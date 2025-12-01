using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.DataAccess.Repository.Concrete
{
    public class WorkerRepository : IWorkerRepository
    {
        private readonly DataContext _context;

        public WorkerRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Worker>> GetAllAsync()
        {
            return await _context.Workers.Include(w => w.Store).ToListAsync();
        }

        public async Task<Worker?> GetByIdAsync(int id)
        {
            return await _context.Workers.Include(w => w.Store).FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task<Worker?> GetByStoreIdAsync(int storeId)
        {
            return await _context.Workers.Include(w => w.Store).FirstOrDefaultAsync(w => w.StoreId == storeId);
        }

        public async Task<Worker> AddAsync(Worker worker)
        {
            _context.Workers.Add(worker);
            await _context.SaveChangesAsync();
            return worker;
        }

        public async Task<Worker?> UpdateAsync(Worker worker)
        {
            var existing = await _context.Workers.FindAsync(worker.Id);
            if (existing == null) return null;

            _context.Entry(existing).CurrentValues.SetValues(worker);
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var worker = await _context.Workers.FindAsync(id);
            if (worker == null) return false;

            _context.Workers.Remove(worker);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
