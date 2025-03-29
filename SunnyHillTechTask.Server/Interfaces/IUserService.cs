namespace SunnyHillTechTask.Server.Interfaces
{
    public interface IUserService
    {
        Task<bool> UpdateEmailAsync(string userId, string newEmail);
        Task<bool> UpdatePasswordAsync(string userId, string newPassword);

    }
}
