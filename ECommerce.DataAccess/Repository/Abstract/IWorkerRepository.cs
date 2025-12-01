using ECommerce.DataAccess.Entity;

namespace ECommerce.DataAccess.Repository.Abstract
{
    public interface IWorkerRepository
    {
        Task<List<Worker>> GetAllAsync();
        Task<Worker?> GetByIdAsync(int id);
        Task<Worker> AddAsync(Worker worker);
        Task<Worker?> UpdateAsync(Worker worker);
        Task<bool> DeleteAsync(int id);
        Task<Worker?> GetByStoreIdAsync(int storeId);
    }
}
