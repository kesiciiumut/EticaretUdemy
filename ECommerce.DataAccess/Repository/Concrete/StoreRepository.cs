using ECommerce.DataAccess.Context;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.DataAccess.Repository.Concrete
{
    public class StoreRepository : IStoreRepository
    {
        private readonly DataContext _context;

        public StoreRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Store>> GetAllAsync()
        {
            return await _context.Stores.ToListAsync();
        }

        public async Task<Store?> GetByIdAsync(int id)
        {
            return await _context.Stores.FindAsync(id);
        }

        public async Task<Store> AddAsync(Store store)
        {
            _context.Stores.Add(store);
            await _context.SaveChangesAsync();
            return store;
        }

        public async Task<Store?> UpdateAsync(Store store)
        {
            var existing = await _context.Stores.FindAsync(store.Id);
            if (existing == null) return null;

            _context.Entry(existing).CurrentValues.SetValues(store);
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null) return false;

            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
