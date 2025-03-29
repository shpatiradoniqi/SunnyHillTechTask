namespace SunnyHillTechTask.Server.Interfaces
{
    public interface IUserRepository
    {
        int GetTotalUsers();
        Task<(string Name, string Role)> GetUserInfo(int userId);
    }
}
