using SunnyHillTechTask.Server.DTOs;
using SunnyHillTechTask.Server.Models;
using static SunnyHillTechTask.Server.Repositories.ProductRepository;

namespace SunnyHillTechTask.Server.Interfaces
{
    public interface IProductRepository
    {
        // Get all products
        Task<IEnumerable<ProductDTO>> GetAll();

        // Get a product by its ID
        Task<ProductDTO?> GetById(int id);

        // Create a new product
        Task<ProductDTO> Create(Product product);

        // Update an existing product
        Task<bool> Update(Product product);

        // Delete a product by its ID
        Task<bool> Delete(int id);

        // Get all categories for the dropdown
        Task<IEnumerable<CategoryDTO>> GetAllCategories();

        // Get products with pagination and sorting
        Task<PagedResult<ProductDTO>> GetPagedProducts(int pageIndex, int pageSize, string sortColumn = "Name", bool ascending = true);
        int GetTotalProducts();
    }
}
