using Microsoft.EntityFrameworkCore;
using WebBackend.Models;

namespace WebBackend
{
    public class MyDBContext: DbContext
    {
        public DbSet<User> users { get; set; }
        public DbSet<Recipe> recipes { get; set; }

        public DbSet<LikeRecipe> likerecipe { get; set; }
        public DbSet<Review> reviews { get;  set; }

        public DbSet<BlockedUser> blockedusers { get; set; }
        public MyDBContext(DbContextOptions<MyDBContext> options) : base(options)
        {


        }
    }
}
