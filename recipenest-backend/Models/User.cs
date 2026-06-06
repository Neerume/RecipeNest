using System.ComponentModel.DataAnnotations;

namespace WebBackend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FullName { get; set; }

        [Required, EmailAddress, MaxLength(255)]
        public string Email { get; set; }

        [Required, MaxLength(50)]
        public string Role { get; set; }

        [Required, MaxLength(50)]
        public string Username { get; set; }

        // Store the hashed password here
        [Required]
        public string PasswordHash { get; set; }  // This is where the hashed password should go

        public string? AboutMe { get; set; }
        public string ?Photo { get; set; }
    }
}
