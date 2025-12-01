namespace ECommerce.DataAccess.Entity.Dtos
{
    public class WorkerDto
    {
        public int Id { get; set; }
        public int StoreId { get; set; }
        public string? StoreName { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public string? Position { get; set; }
        public string? Status { get; set; }
    }
}
