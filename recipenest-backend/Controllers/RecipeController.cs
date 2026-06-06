using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using WebBackend.Models;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WebBackend.Controllers
{
    // This tells ASP.NET Core that this class is an API controller
    [ApiController]

    // The route to access this controller will be: api/Recipe
    [Route("api/[controller]")]
    public class RecipeController : ControllerBase
    {
        // This is used to access the database
        private readonly MyDBContext _context;

        // The directory to save the uploaded images
        private readonly string _imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "UploadedImages");

        // Constructor: gets the database context through dependency injection
        public RecipeController(MyDBContext context)
        {
            _context = context;

            // Create the image directory if it doesn't exist
            if (!Directory.Exists(_imageDirectory))
            {
                Directory.CreateDirectory(_imageDirectory);
            }
        }

        // This action is called when you send a POST request to api/Recipe
        // It creates (adds) a new recipe in the database, along with an uploaded image
        [HttpPost("Create")]
        public async Task<IActionResult> Create(
    [FromForm, Bind("RecipeName,CookingTime,Ingredients,Recipee,UserId")] Recipe recipe,
    [FromForm(Name = "ImageFile")] IFormFile image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate the image file extension
            if (image != null && image.Length > 0)
            {
                // Get the file extension and check if it's a valid image type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
                var fileExtension = Path.GetExtension(image.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid image file type. Only JPG, JPEG, and PNG are allowed.");
                }

                // Create a unique file name for the image
                string fileName = recipe.RecipeName.Replace(" ", "_") + "_" + Guid.NewGuid().ToString() + fileExtension;
                string filePath = Path.Combine(_imageDirectory, fileName);

                // Save the image to the server
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                // Store the file path in the database or URL path for later retrieval
                recipe.Image = $"/uploadedimages/{fileName}";
            }

            _context.recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe);
        }

        // GET: api/Recipe
        [HttpGet("allrecipe")]
        public IActionResult GetAll()
        {
            var recipes = _context.recipes.ToList();
            if (recipes == null || !recipes.Any())
            {
                return NotFound();
            }
            return Ok(recipes);
        }

        // This action is called when a GET request is sent to api/Recipe/{id}
        // It returns a single recipe based on the given ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            // Try to find the recipe with the given ID
            var recipe = _context.recipes.Find(id);

            // If not found, return 404 Not Found
            if (recipe == null)
            {
                return NotFound();
            }

            // If found, return the recipe with status 200 OK
            return Ok(recipe);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] Recipe updatedRecipe, [FromForm(Name = "ImageFile")] IFormFile image)
        {
            var recipe = await _context.recipes.FindAsync(id);
            if (recipe == null)
            {
                return NotFound(); // Recipe not found
            }

            // Update recipe properties (excluding image)
            recipe.RecipeName = updatedRecipe.RecipeName;
            recipe.CookingTime = updatedRecipe.CookingTime;
            recipe.Ingredients = updatedRecipe.Ingredients;
            recipe.Recipee = updatedRecipe.Recipee;

            // Update image if a new one is uploaded
            if (image != null && image.Length > 0)
            {
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
                var fileExtension = Path.GetExtension(image.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid image file type. Only JPG, JPEG, and PNG are allowed.");
                }

                string newFileName = updatedRecipe.RecipeName.Replace(" ", "_") + "_" + Guid.NewGuid().ToString() + fileExtension;
                string newFilePath = Path.Combine(_imageDirectory, newFileName);

                using (var fileStream = new FileStream(newFilePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                recipe.Image = $"/uploadedimages/{newFileName}"; // Save the image URL in the recipe
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(recipe); // Return updated recipe
        }
    
        //this is to get the recipe from the user that loggs in 
        [HttpGet("user/{userId}")]
        public IActionResult GetRecipesByUserId(int userId)
        {
            var recipes = _context.recipes.Where(r => r.UserId == userId).ToList();
            if (recipes == null || !recipes.Any())
            {
                return NotFound();
            }
            return Ok(recipes);
        }

        //to delete the selected recipe
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var recipe = await _context.recipes.FindAsync(id);
            if (recipe == null)
            {
                return NotFound();
            }
            _context.recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("all")]
        public IActionResult GetAllChefRecipe()
        {
            var recipes = _context.recipes
                .Select(r => new {
                    r.Id,
                    r.RecipeName,
                    r.UserId,
                    ChefFullName = _context.users
                        .Where(u => u.Id == r.UserId)
                        .Select(u => u.FullName)
                        .FirstOrDefault()
                })
                .ToList();

            // Always return 200 with the list, even if empty
            return Ok(recipes);
        }


    }
}
