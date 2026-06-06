using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebBackend.Models;

namespace WebBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlockedUserController : ControllerBase
    {
        private readonly MyDBContext _context;

        public BlockedUserController(MyDBContext context)
        {
            _context = context;
        }

        [HttpPost("block")]
        public async Task<IActionResult> BlockUser([FromBody] BlockedUserDto request)
        {
            Console.WriteLine($"Blocking user with ID: {request.UserId}, Remark: {request.Remark}");

            var user = await _context.users.FindAsync(request.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var alreadyBlocked = await _context.blockedusers
                .AnyAsync(b => b.UserId == request.UserId);

            if (alreadyBlocked)
            {
                return BadRequest("User is already blocked.");
            }

            var blockedUser = new BlockedUser
            {
                UserId = request.UserId,
                FullName = user.FullName,
                Remark = request.Remark,
                BlockedAt = DateTime.UtcNow
            };

            _context.blockedusers.Add(blockedUser);
            await _context.SaveChangesAsync();

            return Ok("User has been blocked.");
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllBlockedUsers()
        {
            var blockedUsers = await _context.blockedusers
                .Join(
                    _context.users,
                    blocked => blocked.UserId,
                    user => user.Id,
                    (blocked, user) => new
                    {
                        blocked.Id,
                        blocked.UserId,
                        blocked.FullName,
                        blocked.Remark,
                        blocked.BlockedAt,
                        Role = user.Role
                    }
                ).ToListAsync();

            return Ok(blockedUsers);
        }

        [HttpDelete("unblock/{userId}")]
        public async Task<IActionResult> UnblockUser(int userId)
        {
            var blockedUser = await _context.blockedusers
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (blockedUser == null)
                return NotFound("User is not blocked.");

            _context.blockedusers.Remove(blockedUser);
            await _context.SaveChangesAsync();

            return Ok("User has been unblocked.");
        }

    }

}
