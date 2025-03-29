using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SunnyHillTechTask.Server.DTOs;
using SunnyHillTechTask.Server.Interfaces;
using SunnyHillTechTask.Server.Models;

namespace SunnyHillTechTask.Server.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        // GET: api/products
        [HttpGet]
        [Authorize(Roles = "StandardUser, Admin")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var products = await _productRepository.GetAll();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/products/1
        [HttpGet("{id}")]
        [Authorize(Roles = "StandardUser, Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var product = await _productRepository.GetById(id);
                if (product == null)
                    return NotFound();

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/products
        [HttpPost]
        [Authorize(Roles = "Admin")] // Only Admin can create products
        public async Task<IActionResult> Create([FromBody] ProductDTO productDto)
        {
            try
            {
                // Create a Product from ProductDTO
                var product = new Product
                {
                    Name = productDto.Name,
                    Price = productDto.Price,
                    Quantity = productDto.Quantity,
                    Status = productDto.Status, 
                    CategoryId = productDto.CategoryId
                };

                // Call repository to create the product
                var createdProduct = await _productRepository.Create(product);

                // Return Created response with the location of the newly created product
                return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, createdProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/products/1
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDTO productDto)
        {
            try
            {
                if (id != productDto.Id)
                    return BadRequest("Product ID mismatch");

                var product = new Product
                {
                    Id = productDto.Id,
                    Name = productDto.Name,
                    Price = productDto.Price,
                    Quantity = productDto.Quantity,
                    Status = productDto.Status,
                    CategoryId = productDto.CategoryId
                };

                var updated = await _productRepository.Update(product);
                if (!updated)
                    return NotFound();

                return Ok(productDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // DELETE: api/products/1
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only Admin can delete products
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                // Call repository to delete the product
                var success = await _productRepository.Delete(id);
                if (!success)
                    return NotFound();

                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/products/categories
        // This method returns all categories for the dropdown
        [HttpGet("categories")]
        [Authorize(Roles = "StandardUser, Admin")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _productRepository.GetAllCategories();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/products/paged?pageIndex=1&pageSize=10
        // This method returns a paginated list of products
        [HttpGet("paged")]
        [Authorize(Roles = "StandardUser, Admin")]
        public async Task<IActionResult> GetPagedProducts(int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                var pagedProducts = await _productRepository.GetPagedProducts(pageIndex, pageSize);
                return Ok(pagedProducts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
