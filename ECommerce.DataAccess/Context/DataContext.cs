using ECommerce.DataAccess.Entity;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.DataAccess.Context
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Product → Stock (1'e çok)
            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Product)
                .WithMany(p => p.Stocks)
                .HasForeignKey(s => s.ProductId);

            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Store)
                .WithMany(st => st.Stocks)
                .HasForeignKey(s => s.StoreId);

            modelBuilder.Entity<Return>()
                .HasOne(r => r.Product)
                .WithMany()
                .HasForeignKey(r => r.ProductId);

        }

        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<Sale> Sales { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<MonthlyTurnover> MonthlyTurnovers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<UserActionLog> UserActionLogs { get; set; }
        public DbSet<Worker> Workers { get; set; }
        public DbSet<Return> Returns { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<StockTransfer> StockTransfers { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }
        public DbSet<CartItem> CartItems { get; set; }



    }
}
