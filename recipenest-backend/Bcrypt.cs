namespace WebBackend
{
    public class Bcrypt
    {
        // Method to hash the password using bcrypt
        // Takes the plain-text password and returns the hashed version with salt
        public string HashPassword(string password)
        {
            // Hash the password using bcrypt. The HashPassword function automatically handles 
            // generating a salt and combining it with the password for hashing.
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Method to verify if a password matches the hash
        // Takes the plain-text password entered by the user and the hashed password stored in the database
        // Returns true if the password matches, otherwise false
        public bool VerifyPassword(string password, string hashedPassword)
        {
            // The Verify function hashes the entered password with the stored salt (embedded in the hash) 
            // and compares it with the stored hash to check if they match.
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
