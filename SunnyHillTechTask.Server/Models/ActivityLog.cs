namespace SunnyHillTechTask.Server.Models
{
    public class ActivityLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Action { get; set; } // "Created Product", "Deleted Product", "Updated Profile"
        public DateTime Timestamp { get; set; }
    }

}
