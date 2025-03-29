using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SunnyHillTechTask.Server.DTOs;
using SunnyHillTechTask.Server.Interfaces;
using SunnyHillTechTask.Server.Models;
using SunnyHillTechTask.Server.Services;

namespace SunnyHillTechTask.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(registerDto.Name) ||
                    string.IsNullOrWhiteSpace(registerDto.Email) ||
                    string.IsNullOrWhiteSpace(registerDto.Password))
                {
                    return BadRequest(new { message = "Name, Email, and Password are required." });
                }

                var user = new User
                {
                    Name = registerDto.Name,
                    Email = registerDto.Email
                };

                var registeredUser = await _authRepository.Register(user, registerDto.Password);

                if (registeredUser == null)
                {
                    return BadRequest(new { message = "User registration failed." });
                }

                return Ok(new { message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration.", error = ex.Message });
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            var token = await _authRepository.Login(loginDTO);
            if (token == null) return Unauthorized();
            return Ok(new { token });
        }
    }
}
