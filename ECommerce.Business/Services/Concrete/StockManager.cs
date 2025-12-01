using ECommerce.Business.Services.Abstract;
using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Entity;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Business.Services.Concrete
{
    public class StockManager : IStockService
    {
        private readonly DbContext _context;

        public StockManager(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Stock>> GetAllStocks()
        {
            return await _context.Set<Stock>().ToListAsync();
        }

        public async Task<Stock?> GetStockById(int id)
        {
            
            return await _context.Set<Stock>().FindAsync(id);
        }

        public async Task<Stock> AddStock(Stock stock)
        {
            var existing = await _context.Set<Stock>()
                .FirstOrDefaultAsync(s => s.ProductId == stock.ProductId && s.StoreId == stock.StoreId);

            if (existing != null)
            {
                existing.Quantity += stock.Quantity;
                await _context.SaveChangesAsync();
                return existing;
            }
            else
            {
                _context.Set<Stock>().Add(stock);
                await _context.SaveChangesAsync();
                return stock;
            }
        }


        public async Task<Stock?> UpdateStock(int id, Stock stock)
        {
            var existing = await _context.Set<Stock>().FindAsync(id);
            if (existing == null)
                return null;

            existing.ProductId = stock.ProductId;
            existing.StoreId = stock.StoreId;
            existing.Quantity = stock.Quantity;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteStock(int id)
        {
            var stock = await _context.Set<Stock>().FindAsync(id);
            if (stock == null)
                return false;

            _context.Set<Stock>().Remove(stock);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Stock?> DecreaseStock(int id, int decreaseAmount)
        {
            var stock = await _context.Set<Stock>().FindAsync(id);
            if (stock == null || stock.Quantity < decreaseAmount)
                return null;

            stock.Quantity -= decreaseAmount;
            await _context.SaveChangesAsync();
            return stock;
        }

        public async Task<bool> TransferStock(int productId, int fromStoreId, int toStoreId, int quantity)
        {
            var fromStock = await _context.Set<Stock>().FirstOrDefaultAsync(s => s.ProductId == productId && s.StoreId == fromStoreId);
            var toStock = await _context.Set<Stock>().FirstOrDefaultAsync(s => s.ProductId == productId && s.StoreId == toStoreId);

            if (fromStock == null || fromStock.Quantity < quantity)
                return false;

            fromStock.Quantity -= quantity;

            if (toStock == null)
            {
                toStock = new Stock
                {
                    ProductId = productId,
                    StoreId = toStoreId,
                    Quantity = quantity
                };
                _context.Set<Stock>().Add(toStock);
            }
            else
            {
                toStock.Quantity += quantity;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<StockTransfer>> GetTransfers(int? productId = null, int? storeId = null)
        {
            var query = _context.Set<StockTransfer>().AsQueryable();
            if (productId.HasValue)
                query = query.Where(t => t.ProductId == productId.Value);
            if (storeId.HasValue)
                query = query.Where(t => t.FromStoreId == storeId.Value || t.ToStoreId == storeId.Value);

            return await query.ToListAsync();
        }

        // Yeni eklenen metot:
        public async Task<List<Stock>> GetStocksForStore(int storeId, List<int> productIds)
        {
            return await _context.Set<Stock>()
                .Where(s => s.StoreId == storeId && productIds.Contains(s.ProductId))
                .ToListAsync();
        }
    }
}
