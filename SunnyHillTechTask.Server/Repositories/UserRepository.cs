using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using SunnyHillTechTask.Server.Interfaces;
using SunnyHillTechTask.Server.Models;

namespace SunnyHillTechTask.Server.Repositories
{
    public class UserRepository:IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
            
        }
        public int GetTotalUsers()
        {
            return _context.Users.Count();
        }

        public async Task<(string Name, string Role)> GetUserInfo(int userId)
        {
            var user = await _context.Users
          .Where(u => u.Id == userId)
          .Select(u => new { u.Name, u.Role })
          .FirstOrDefaultAsync();

            return user != null ? (user.Name, user.Role) : ("Unknown", "User");
        }
    }
}
