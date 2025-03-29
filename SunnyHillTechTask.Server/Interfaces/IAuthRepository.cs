using SunnyHillTechTask.Server.DTOs;
using SunnyHillTechTask.Server.Models;

namespace SunnyHillTechTask.Server.Interfaces
{
    public interface IAuthRepository
    {
        Task<User?> Register(User user, string password);
        Task<string?> Login(LoginDTO loginDTO);
    }
}
