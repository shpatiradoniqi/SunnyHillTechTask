using Konscious.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using SunnyHillTechTask.Server.DTOs;
using SunnyHillTechTask.Server.Interfaces;
using SunnyHillTechTask.Server.Models;
using SunnyHillTechTask.Server.Services;
using System.Security.Cryptography;
using System.Text;

namespace SunnyHillTechTask.Server.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthRepository(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<User?> Register(User user, string password)
        {
            user.PasswordHash = HashPassword(password); // Use Argon2
            user.Role = "StandardUser"; // Assign default role
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        
        public async Task<string?> Login(LoginDTO loginDTO)
        {
            // Fetch user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDTO.Email);

            // Check if the user exists and if the password matches the stored hash
            if (user == null || !VerifyPassword(password: loginDTO.Password, storedHash: user.PasswordHash))
                return null;

            // Generate JWT token
            return _jwtService.GenerateToken(user);
        }


        public bool VerifyPassword(string password, string storedHash)
        {
            try
            {
                Console.WriteLine("Stored Hash: " + storedHash); // Log the stored hash for inspection

                var parts = storedHash.Split('$');
                if (parts.Length != 5)
                {
                    throw new Exception($"Invalid hash format: {storedHash}");
                }

                // Extract salt and hash from the stored hash
                var salt = Convert.FromBase64String(parts[3]); // Extract salt
                var storedHashValue = parts[4]; // Extract the stored hash

                var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
                {
                    Salt = salt,
                    Iterations = 3,
                    MemorySize = 65536,
                    DegreeOfParallelism = 2
                };

                var hashBytes = argon2.GetBytes(32);
                var computedHash = Convert.ToBase64String(hashBytes);

                return storedHashValue == computedHash;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Password verification failed: {ex.Message}");
                throw;
            }
        }

        public string HashPassword(string password)
        {
            // Generate salt
            var salt = new byte[16]; // 16 bytes for salt
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt);
            }

            // Hash the password using Argon2
            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
            {
                Salt = salt,
                Iterations = 3,
                MemorySize = 65536,
                DegreeOfParallelism = 2
            };

            // Get the hashed password
            var hashBytes = argon2.GetBytes(32); // 32 bytes for the hash
            var computedHash = Convert.ToBase64String(hashBytes);

            // Return the formatted hash with salt included
            return $"argon2id$v=19$m=65536,t=3,p=2${Convert.ToBase64String(salt)}${computedHash}";
        }



    }
}

