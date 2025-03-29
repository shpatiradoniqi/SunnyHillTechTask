using Microsoft.EntityFrameworkCore;
using SunnyHillTechTask.Server.DTOs;
using SunnyHillTechTask.Server.Interfaces;
using SunnyHillTechTask.Server.Models;

namespace SunnyHillTechTask.Server.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }
        public int GetTotalProducts()
        {
            return _context.Products.Count();
        }
      // Get all products as ProductDTO, including CategoryId
    public async Task<IEnumerable<ProductDTO>> GetAll()
        {
            return await _context.Products
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Status = p.Status,
                    CategoryId = p.CategoryId  
                })
                .ToListAsync();
        }

        // Get product by ID with CategoryId
        public async Task<ProductDTO?> GetById(int id)
        {
            return await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Status = p.Status,
                    CategoryId = p.CategoryId  
                })
                .FirstOrDefaultAsync();
        }

        // Create a new product (returns ProductDTO including CategoryId)
        public async Task<ProductDTO> Create(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Quantity = product.Quantity,
                Status = product.Status,
                CategoryId = product.CategoryId  
            };
        }

        // Update an existing product (returns boolean for success)
        public async Task<bool> Update(Product product)
        {
            _context.Products.Update(product);
            return await _context.SaveChangesAsync() > 0;
        }

        // Delete a product by ID
        public async Task<bool> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;
            _context.Products.Remove(product);
            return await _context.SaveChangesAsync() > 0;
        }

        // Get products with pagination and sorting (including CategoryId)
        public async Task<PagedResult<ProductDTO>> GetPagedProducts(int pageIndex, int pageSize, string sortColumn = "Name", bool ascending = true)
        {
            var query = _context.Products.AsQueryable();

            // Sorting logic
            query = ascending
                ? query.OrderBy(p => EF.Property<object>(p, sortColumn))
                : query.OrderByDescending(p => EF.Property<object>(p, sortColumn));

            // Pagination logic
            var totalCount = await query.CountAsync();
            var products = await query
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Status = p.Status,
                    CategoryId = p.CategoryId  // Ensure CategoryId is included
                })
                .ToListAsync();

            return new PagedResult<ProductDTO>
            {
                TotalCount = totalCount,
                Items = products
            };
        }
        public async Task<IEnumerable<CategoryDTO>> GetAllCategories()
        {
            return await _context.Categories
                .Select(c => new CategoryDTO
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();
        }

        public class PagedResult<T>
        {
            public int TotalCount { get; set; }
            public IEnumerable<T> Items { get; set; }
        }
    }
}

