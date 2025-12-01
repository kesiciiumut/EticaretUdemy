using ECommerce.DataAccess.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using ECommerce.DataAccess.Entity;


public class StockRepository : IStockRepository
{
    private readonly DataContext _context;

    public StockRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<List<Stock>> GetAllStocks()
    {
        return await _context.Stocks
            .Include(s => s.Product)
            .Include(s => s.Store)
            .ToListAsync();
    }
    public async Task<Stock?> GetStockById(int id)
    {
        return await _context.Stocks
            .Include(s => s.Store)
            .Include(s => s.Product)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Stock> AddStock(Stock stock)
    {
        // Aynı ürün ve mağaza için stok var mı kontrol et
        var existing = await _context.Stocks
            .FirstOrDefaultAsync(s => s.ProductId == stock.ProductId && s.StoreId == stock.StoreId);

        if (existing != null)
        {
            // Varsa miktarı güncelle
            existing.Quantity += stock.Quantity;
            await _context.SaveChangesAsync();
            return existing;
        }
        else
        {
            // Yoksa yeni stok ekle
            _context.Stocks.Add(stock);
            await _context.SaveChangesAsync();
            return stock;
        }
    }


    public async Task<Stock?> UpdateStock(int id, Stock stock)
    {
        var existing = await _context.Stocks.FindAsync(id);
        if (existing == null) return null;

        existing.ProductId = stock.ProductId;
        existing.StoreId = stock.StoreId;
        existing.Quantity = stock.Quantity;
        // Eğer başka alanlar eklediysen onları da güncelle

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteStock(int id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null) return false;

        _context.Stocks.Remove(stock);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<Stock?> DecreaseStock(int id, int decreaseAmount)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null || stock.Quantity < decreaseAmount)
            return null;

        stock.Quantity -= decreaseAmount;
        await _context.SaveChangesAsync();
        return stock;
    }
    public async Task<bool> TransferStock(int productId, int fromStoreId, int toStoreId, int quantity)
    {
        var fromStock = await _context.Stocks
            .FirstOrDefaultAsync(s => s.ProductId == productId && s.StoreId == fromStoreId);
        if (fromStock == null || fromStock.Quantity < quantity)
            return false;

        fromStock.Quantity -= quantity;

        var toStock = await _context.Stocks
            .FirstOrDefaultAsync(s => s.ProductId == productId && s.StoreId == toStoreId);
        if (toStock == null)
        {
            toStock = new Stock { ProductId = productId, StoreId = toStoreId, Quantity = 0 };
            _context.Stocks.Add(toStock);
        }
        toStock.Quantity += quantity;

        var transfer = new StockTransfer
        {
            ProductId = productId,
            FromStoreId = fromStoreId,
            ToStoreId = toStoreId,
            Quantity = quantity,
            TransferDate = DateTime.UtcNow
        };
        _context.StockTransfers.Add(transfer);

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<StockTransfer>> GetTransfers(int? productId = null, int? storeId = null)
    {
        var query = _context.StockTransfers
            .Include(t => t.Product)
            .Include(t => t.FromStore)
            .Include(t => t.ToStore)
            .AsQueryable();

        if (productId.HasValue)
            query = query.Where(t => t.ProductId == productId.Value);
        if (storeId.HasValue)
            query = query.Where(t => t.FromStoreId == storeId.Value || t.ToStoreId == storeId.Value);

        return await query.ToListAsync();
    }


}
