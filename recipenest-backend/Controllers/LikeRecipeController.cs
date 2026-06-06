using Microsoft.AspNetCore.Mvc;
using WebBackend.Models;

namespace WebBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LikeRecipeController : Controller
    {
        private readonly MyDBContext _context;

        public LikeRecipeController(MyDBContext context)
        {
            _context = context;
        }

        // POST: api/LikeRecipe/create
        [HttpPost("create")]
        public IActionResult CreateLike([FromBody] LikeRecipe like)
        {
            if (like == null)
            {
                return BadRequest("Invalid data.");
            }

            _context.likerecipe.Add(like);
            _context.SaveChanges();

            return Ok(new { message = "Recipe liked successfully!", like });
        }

        // GET: api/LikeRecipe/retrieve
        // this returns a boolean (true or false) indicating whether the user has liked the specified recipe.
        [HttpGet("retrieve")]
        public IActionResult RetrieveLike([FromQuery] int userId, [FromQuery] int recipeId)
        {
            var like = _context.likerecipe
                .FirstOrDefault(l => l.UserId == userId && l.RecipeId == recipeId);

            if (like == null)
            {
                return Ok(new { liked = false }); 
            }

            return Ok(new { liked = true });
        }

        //to get the liked recipe by a particular user id
        // GET: api/LikeRecipe/liked-recipes/{userId}
        [HttpGet("liked-recipes/{userId}")]
        public IActionResult GetLikedRecipesByUser(int userId)
        {
            var likedRecipes = _context.likerecipe
                .Where(l => l.UserId == userId)
                .Select(l => new
                {
                    Recipe = _context.recipes.FirstOrDefault(r => r.Id == l.RecipeId),
                    LikedAt = l.LikedAt.ToString("o") // Ensure it's in ISO 8601 format
                })
                .ToList();

            return Ok(likedRecipes);
        }

        // GET: api/LikeRecipe/{recipeId}
        [HttpGet("{recipeId}")]
        public IActionResult GetLikesByRecipeId(int recipeId)
        {
            var likes = _context.likerecipe
                .Where(l => l.RecipeId == recipeId)
                .ToList();

            return Ok(likes);
        }



    }
}
