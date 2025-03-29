using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunnyHillTechTask.Server.Interfaces;
using System.Security.Claims;

namespace SunnyHillTechTask.Server.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    [Authorize] // Requires authentication
    public class DashboardController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly IUserRepository _userRepo;

        public DashboardController(IProductRepository productRepo, IUserRepository userRepo)
        {
            _productRepo = productRepo;
            _userRepo = userRepo;
        }

        [HttpGet("products/count")]
        public IActionResult GetTotalProducts()
        {
            int count = _productRepo.GetTotalProducts();
            return Ok(count);
        }

        [HttpGet("users/count")]
        public IActionResult GetTotalUsers()
        {
            int count = _userRepo.GetTotalUsers();
            return Ok(count);
        }

      
        [HttpGet("user/info")]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var (name, role) = await _userRepo.GetUserInfo(userId);
            return Ok(new { name, role });
        }


    }
}
