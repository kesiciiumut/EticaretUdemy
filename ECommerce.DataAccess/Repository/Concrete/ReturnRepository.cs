using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Repository.Abstract;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ReturnRepository : IReturnRepository
{
    private readonly DataContext _context;
    public ReturnRepository(DataContext context)
    {
        _context = context;
    }

    public void Add(Return entity)
    {
        _context.Returns.Add(entity);
    }

    public async Task<Return> GetByIdAsync(int id)
    {
        return await _context.Returns
            .Include(r => r.Sale)
            .Include(r => r.Product)
            .Include(r => r.Customer)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public IEnumerable<Return> GetAll()
    {
        return _context.Returns
            .Include(r => r.Sale)
            .Include(r => r.Product)
            .Include(r => r.Customer)
            .ToList();
    }

    public IEnumerable<Return> GetByCustomerId(int customerId)
    {
        return _context.Returns
            .Where(r => r.CustomerId == customerId)
            .Include(r => r.Sale)
            .Include(r => r.Product)
            .ToList();
    }

    public async Task UpdateAsync(Return entity)
    {
        _context.Returns.Update(entity);
        await _context.SaveChangesAsync();
    }

    public void Save()
    {
        _context.SaveChanges();
    }

    public async Task ApproveAsync(int id)
    {
        var returnEntity = await _context.Returns.FindAsync(id);
        if (returnEntity != null)
        {
            returnEntity.ReturnStatus = "Onaylandı";
            await _context.SaveChangesAsync();
        }
    }
    public async Task RejectAsync(int id)
    {
        var returnEntity = await _context.Returns.FindAsync(id);
        if (returnEntity != null)
        {
            returnEntity.ReturnStatus = "Rededildi";
            await _context.SaveChangesAsync();
        }
    }
    public IEnumerable<Return> GetApprovedReturnsByDateRange(DateOnly startDate, DateOnly endDate)
    {
        return _context.Returns
            .Where(r => r.ReturnStatus == "Onaylandı" &&
                        r.ReturnDate >= startDate &&
                        r.ReturnDate <= endDate)
            .Include(r => r.Sale)
            .Include(r => r.Product)
            .Include(r => r.Customer)
            .ToList();
    }
    public int GetTotalReturnCount()
    {
        return _context.Set<Return>().Count();
    }


}
