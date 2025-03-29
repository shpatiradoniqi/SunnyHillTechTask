using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SunnyHillTechTask.Server.Interfaces;
using SunnyHillTechTask.Server.Models;

namespace SunnyHillTechTask.Server.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserService(AppDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }
    
    public async Task<bool> UpdateEmailAsync(string userId, string newEmail)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.Email = newEmail;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePasswordAsync(string userId, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false; 
            }

           
            user.PasswordHash = _passwordHasher.HashPassword(user, newPassword);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
