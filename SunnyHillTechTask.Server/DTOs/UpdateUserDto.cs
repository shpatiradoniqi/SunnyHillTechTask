﻿namespace SunnyHillTechTask.Server.DTOs
{
    public class UpdateUserDto
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
