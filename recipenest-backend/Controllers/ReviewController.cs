using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebBackend.Models;

namespace WebBackend.Controllers
{
    [ApiController]  // Indicate that this is an API controller
    [Route("api/[controller]")]

    public class ReviewController : ControllerBase
    {
        private readonly MyDBContext _context;

        public ReviewController(MyDBContext context)
        {
            _context = context;
        }

        // POST: api/Create
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] Review review)
        {
            _context.reviews.Add(review);
            await _context.SaveChangesAsync();
            return Ok(review);
        }

        [HttpGet("{recipeId}")]
        public async Task<IActionResult> GetReviewsByRecipe(int recipeId)
        {
            var reviews = await (
                from review in _context.reviews
                join user in _context.users on review.UserId equals user.Id
                where review.RecipeId == recipeId
                orderby review.Id descending
                select new
                {
                    review.Id,
                    review.Comment,
                    review.CreatedAt, // include the timestamp
                    Username = user.Username
                }
            ).ToListAsync();

            return Ok(reviews);
        }

    }
}