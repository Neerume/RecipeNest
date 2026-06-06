namespace WebBackend.Models
{
    public class BlockedUser
    {
        public int Id { get; set; } // Primary key
        public int UserId { get; set; } 
        public string FullName { get; set; }
        public string Remark { get; set; }
        public DateTime BlockedAt { get; set; }
    }
}
