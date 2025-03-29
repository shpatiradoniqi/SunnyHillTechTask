namespace SunnyHillTechTask.Server.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
        public int CategoryId { get; set; }  
    }
}
