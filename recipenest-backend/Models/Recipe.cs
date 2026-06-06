using System.ComponentModel.DataAnnotations;

namespace WebBackend.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string RecipeName { get; set; }

        [Required, MaxLength(100)]
        public string CookingTime { get; set; }

        [Required, MaxLength(100)]
        public string Ingredients { get; set; }

        [Required, MaxLength(500)]
        public string Recipee { get; set; }

        public string? Image { get; set; }

        public int UserId { get; set; }

    }
}
