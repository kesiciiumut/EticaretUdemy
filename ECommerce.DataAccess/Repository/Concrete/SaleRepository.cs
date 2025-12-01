using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Entity.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SaleRepository : ISaleRepository
{
    private readonly DataContext _context;

    public SaleRepository(DataContext context)
    {
        _context = context;
    }

    public void Add(Sale sale)
    {
        _context.Sales.Add(sale);
    }

    public IEnumerable<Sale> GetSalesByCustomerId(int customerId)
    {
        return _context.Sales.Where(s => s.CustomerId == customerId).ToList();
    }

    public Sale GetById(int id)
    {
        return _context.Sales
            .Include(s => s.SaleItems)
            .FirstOrDefault(s => s.Id == id);
    }

    public void Save()
    {
        _context.SaveChanges();
    }

    public IEnumerable<SaleItem> GetSaleItems(int saleId)
    {
        return _context.SaleItems
            .Where(si => si.SaleId == saleId)
            .Include(si => si.Product)
            .ToList();
    }

    public IEnumerable<ReturnListDto> GetReturnsByCustomerId(int customerId)
    {
        // Kendi implementasyonunuza göre doldurun
        return new List<ReturnListDto>();
    }

    public IEnumerable<Sale> GetAllSales()
    {
        return _context.Sales.Include(s => s.Customer).ToList();
    }

    public async Task<Sale?> GetByIdAsync(int saleId)
    {
        return await _context.Sales.FindAsync(saleId);
    }

    public async Task UpdateAsync(Sale sale)
    {
        _context.Sales.Update(sale);
        await _context.SaveChangesAsync();
    }
    public int GetTotalSaleCount()
    {
        return _context.Set<Sale>().Count();
    }
}
