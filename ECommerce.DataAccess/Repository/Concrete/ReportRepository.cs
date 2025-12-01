using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Entity.Dtos;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

public class ReportRepository : IReportRepository
{
    private readonly DataContext _context;

    public ReportRepository(DataContext context)
    {
        _context = context;
    }

    public int GetTodayOrderCount()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        return _context.Sales.Count(s => s.SaleDate == today);
    }

    public decimal GetTodayRevenue()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        return _context.Sales
            .Where(s => s.SaleDate == today)
            .Sum(s => s.TotalPrice);
    }

    public int GetTodayApprovedReturnCount()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        return _context.Returns.Count(r => r.ReturnStatus == "Onaylandı" && r.ReturnDate == today);
    }

    public IEnumerable<CriticalStockDto> GetCriticalStockProducts(int threshold = 10)
    {
        return _context.Set<Stock>()
            .Where(s => s.Quantity < threshold)
            .Select(s => new CriticalStockDto
            {
                Product = s.Product.Name,
                Stock = s.Quantity
            })
            .ToList();
    }

    public IEnumerable<TopSellingProductDto> GetTopSellingProducts(int days)
    {
        var startDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-days));

        return _context.Set<SaleItem>()
            .Where(si => si.Sale.SaleDate >= startDate)
            .GroupBy(si => si.Product.Name)
            .Select(g => new TopSellingProductDto
            {
                Product = g.Key,
                Sold = g.Sum(x => x.Quantity),
                Revenue = g.Sum(x => x.Quantity * x.UnitPrice)
            })
            .OrderByDescending(x => x.Sold)
            .Take(10)
            .ToList();
    }

    public decimal GetWeeklySalesAmount(DateTime startDate, DateTime endDate)
    {
        var start = DateOnly.FromDateTime(startDate);
        var end = DateOnly.FromDateTime(endDate);

        return _context.Sales
            .Where(s => s.SaleDate >= start && s.SaleDate <= end)
            .Sum(s => s.TotalPrice);
    }

    public decimal GetLastWeekSalesAmount(DateTime startDate, DateTime endDate)
    {
        var start = DateOnly.FromDateTime(startDate);
        var end = DateOnly.FromDateTime(endDate);

        return _context.Sales
            .Where(s => s.SaleDate >= start && s.SaleDate <= end)
            .Sum(s => s.TotalPrice);
    }

    public int GetProductCount()
    {
        return _context.Products.Count();
    }

    public int GetStoreCount()
    {
        return _context.Stores.Count();
    }

    public IEnumerable<SaleNotificationDto> GetRecentSaleNotifications(int count = 5)
    {
        return _context.Sales
            .OrderByDescending(s => s.SaleDate)
            .Take(count)
            .Select(s => new SaleNotificationDto
            {
                Title = "Satış",
                Description = $"{s.Customer.Name} tarafından sipariş alındı",
                SaleDate = s.SaleDate.ToDateTime(TimeOnly.MinValue)
            })
            .ToList();
    }

    public IEnumerable<Sale> GetSalesBetweenDates(DateOnly start, DateOnly end)
    {
        return _context.Sales
            .Where(s => s.SaleDate >= start && s.SaleDate <= end)
            .ToList();
    }

    public IEnumerable<Return> GetApprovedReturnsBetweenDates(DateOnly start, DateOnly end)
    {
        return _context.Returns
            .Where(r => r.ReturnDate >= start && r.ReturnDate <= end && r.ReturnStatus == "Onaylandı")
            .ToList();
    }

    public void TransferStock(int fromStoreId, int toStoreId, int productId, int quantity)
    {
        var fromStock = _context.Stocks.FirstOrDefault(s => s.StoreId == fromStoreId && s.ProductId == productId);
        var toStock = _context.Stocks.FirstOrDefault(s => s.StoreId == toStoreId && s.ProductId == productId);

        if (fromStock == null || fromStock.Quantity < quantity)
            throw new InvalidOperationException("Yetersiz stok.");

        fromStock.Quantity -= quantity;

        if (toStock == null)
        {
            toStock = new Stock
            {
                StoreId = toStoreId,
                ProductId = productId,
                Quantity = 0
            };
            _context.Stocks.Add(toStock);
        }
        toStock.Quantity += quantity;

        _context.StockTransfers.Add(new StockTransfer
        {
            ProductId = productId,
            FromStoreId = fromStoreId,
            ToStoreId = toStoreId,
            Quantity = quantity,
            TransferDate = DateTime.Now
        });

        _context.SaveChanges();
    }

    public IEnumerable<ProductDto> GetAllProducts()
    {
        return _context.Products
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name
            })
            .ToList();
    }

    public IEnumerable<StockTransfer> GetTransferHistory()
    {
        return _context.StockTransfers
            .Include(t => t.Product)
            .Include(t => t.FromStore)
            .Include(t => t.ToStore)
            .OrderByDescending(t => t.TransferDate)
            .ToList();
    }

    // DÜZELTİLEN METOT: Arayüz ile uyumlu hale getirildi
    public IEnumerable<Stock> GetAllStocks()
    {
        return _context.Stocks
            .Include(s => s.Product)
            .Include(s => s.Store)
            .ToList();
    }

    public IEnumerable<Store> GetAllStores()
    {
        return _context.Stores.ToList();
    }
}
