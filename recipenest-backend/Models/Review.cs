namespace WebBackend.Models
{
    public class Review
    {
        public int Id { get; set; }       
        public int UserId { get; set; }      
        public int RecipeId { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;


    }
}
