namespace WebBackend.Models
{
    //this calss will hold the raw data 
    public class Register
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        public string Password { get; set; } // This will hold the raw password input
        public string ConfirmPassword { get; set; } // Confirm password
    }
}
