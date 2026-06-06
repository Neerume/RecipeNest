using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebBackend.Models; // Add your model namespace

namespace WebBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase  // Inherit from ControllerBase for API
    {
        private readonly MyDBContext _context;
        private readonly Bcrypt _bcrypt; // Injected Bcrypt service
        private readonly string _imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "ProfileImages");


        // Constructor with dependency injection for Bcrypt and UserContext
        public UserController(MyDBContext context, Bcrypt bcrypt)
        {
            _context = context;
            _bcrypt = bcrypt; // Assigning the Bcrypt service
        }

        // POST: api/User/Create
        [HttpPost("Create")] //  POST route for creating users
        public IActionResult Create([FromBody] Register reg)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);  // If the model is not valid, return a 400 BadRequest with validation errors
            }

            // Ensure that the password and confirm password match
            if (reg.Password != reg.ConfirmPassword)
            {
                return BadRequest("Passwords do not match."); // Return 400 with message if passwords don't match
            }
            if (_context.users.Any(u => u.Email == reg.Email))
            {
                return BadRequest("Email already exists.");
            }

            // Encrypt the password using the injected Bcrypt service
            string hashedPassword = _bcrypt.HashPassword(reg.Password); // here hashing tth password is abstracted 

            // Map the Register model to User
            User user = new User
            {
                FullName = reg.FullName,
                Email = reg.Email,
                Role = reg.Role,
                Username = reg.Username,
                PasswordHash = hashedPassword // Store the hashed password
            };

            try
            {
                // Save the user to the database
                _context.users.Add(user);  // Add to the correct DbSet
                _context.SaveChanges();
                return Ok(user); // Return 200 OK with the created user (or any relevant data)
            }
            catch
            {
                return StatusCode(500, "Internal server error while saving user."); // Return 500 if an error occurs
            }
        }

        // Login
        [HttpPost("Login")]
        public IActionResult Login([FromBody] Login login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find user by email
            var user = _context.users.FirstOrDefault(u => u.Email == login.Email);

            if (user == null)
            {
                return Unauthorized("Invalid email");
            }

            // Verify password using Bcrypt
            bool isPasswordValid = _bcrypt.VerifyPassword(login.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid password.");
            }

            // If login successful, return basic user info
            return Ok(new
            {
                message = "Login successful",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role,
                    user.Username
                }
            });
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] UpdateUser model, [FromForm(Name = "PhotoFile")] IFormFile photo)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update only if values are provided
            if (!string.IsNullOrEmpty(model.FullName)) user.FullName = model.FullName;
            if (!string.IsNullOrEmpty(model.Email)) user.Email = model.Email;
            if (!string.IsNullOrEmpty(model.Role)) user.Role = model.Role;
            if (!string.IsNullOrEmpty(model.Username)) user.Username = model.Username;
            if (!string.IsNullOrEmpty(model.AboutMe)) user.AboutMe = model.AboutMe;

            // Handle profile photo upload
            if (photo != null && photo.Length > 0)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
                var fileExtension = Path.GetExtension(photo.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid image file type. Only JPG, JPEG, and PNG are allowed.");
                }

                string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "ProfileImages");

                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                string fileName = Guid.NewGuid().ToString() + fileExtension;
                string filePath = Path.Combine(directoryPath, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await photo.CopyToAsync(fileStream);
                }

                user.Photo = $"/profileimages/{fileName}";
            }

            // Force entity state as modified to ensure EF tracks the changes
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Profile updated successfully", user });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Save error: {ex.Message}");
                return BadRequest($"Update failed. {ex.Message}");
            }
        }

        [HttpGet("chefs")]
        public async Task<IActionResult> GetAllChefs()
        {
            // Fetch all chefs with like count and comments from the Review table, excluding blocked users
            var chefs = await _context.users
                .Where(u => u.Role == "Chef" &&
                            !_context.blockedusers.Any(b => b.UserId == u.Id)) // Exclude blocked users
                .Select(chef => new
                {
                    chef.Id,
                    chef.FullName,
                    chef.AboutMe,
                    chef.Photo,
                    // Fetch the recipes associated with the chef based on UserId
                    Recipes = _context.recipes
                        .Where(r => r.UserId == chef.Id)
                        .Select(r => new
                        {
                            r.Id,
                            r.RecipeName,  // Adjust property name if needed
                                           // Count the number of likes from the LikeRecipe table for each recipe
                            LikeCount = _context.likerecipe
                                .Count(l => l.RecipeId == r.Id),
                            // Fetch the comments associated with each recipe from the Review table
                            Comments = _context.reviews
                                .Where(rev => rev.RecipeId == r.Id)
                                .Select(rev => new
                                {
                                    rev.Id,
                                    rev.Comment,
                                    rev.CreatedAt
                                })
                                .ToList()
                        })
                        .ToList()
                })
                .ToListAsync();

            if (chefs == null || !chefs.Any())
            {
                return NotFound("No chefs found.");
            }

            return Ok(chefs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Return the full User model directly here
            return Ok(user); // This will include Photo, FullName, Email, etc.
        }

        [HttpGet("top-chefs")]
        public async Task<IActionResult> GetTopChefs()
        {
            var topChefs = await _context.users
                .Where(u => u.Role == "Chef")
                .Select(chef => new
                {
                    chef.Id,
                    chef.FullName,
                    chef.AboutMe,
                    chef.Photo,
                    // Get the number of likes for the recipes created by this chef
                    TotalLikes = _context.recipes
                        .Where(r => r.UserId == chef.Id)
                        .Sum(r => _context.likerecipe.Count(l => l.RecipeId == r.Id))
                })
                .OrderByDescending(c => c.TotalLikes) // Sort by total likes in descending order
                .Take(5) // Limit to top 5 chefs (or adjust this number as needed)
                .ToListAsync();

            if (topChefs == null || topChefs.Count == 0)
            {
                return NotFound("No chefs found.");
            }

            return Ok(topChefs); // Return the list of top chefs
        }

        [HttpGet("foodlovers")]
        public IActionResult GetFoodLovers()
        {
            var foodLovers = _context.users
                .Where(u => u.Role == "FoodLover")
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,

                    // Count of likes made by this user
                    TotalLikes = _context.likerecipe.Count(lr => lr.UserId == u.Id),

                    // Count of comments made by this user
                    TotalComments = _context.reviews.Count(r => r.UserId == u.Id)
                })
                .ToList();

            return Ok(foodLovers);
        }

        [HttpGet("analytics")]
        public IActionResult GetAppAnalytics()
        {
            var totalUsers = _context.users.Count();
            var totalChefs = _context.users.Count(u => u.Role == "Chef");
            var totalFoodLovers = _context.users.Count(u => u.Role == "FoodLover");

            var totalRecipes = _context.recipes.Count();
            var totalLikes = _context.likerecipe.Count();
            var totalComments = _context.reviews.Count();

            var engagementStats = new
            {
                TotalUsers = totalUsers,
                TotalChefs = totalChefs,
                TotalFoodLovers = totalFoodLovers,
                TotalRecipes = totalRecipes,
                TotalLikes = totalLikes,
                TotalComments = totalComments
            };

            return Ok(engagementStats);
        }


    }
}