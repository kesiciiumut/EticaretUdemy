namespace ECommerce.DataAccess.Entity
{
    public class MonthlyTurnover
    {

        public int Id { get; set; }
        public int StoreId { get; set; }
        public string? Month { get; set; }
        public int? TotalSales { get; set; }
        public decimal? TotalRevenue { get; set; }
        public decimal? TotalReturn { get; set; }
        public decimal? NetRevenue { get; set; }
        public ICollection<Sale> Sales { get; set; }
        public ICollection<Stock> Stocks { get; set; }
        public ICollection<Return> Returns { get; set; }


    }
}
