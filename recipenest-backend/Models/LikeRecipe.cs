namespace WebBackend.Models
{
    public class LikeRecipe
    {

        public int Id { get; set; }
        public int RecipeId { get; set; }
        public int UserId { get; set; } 
        public DateTime LikedAt { get; set; } = DateTime.Now;
    }
}
