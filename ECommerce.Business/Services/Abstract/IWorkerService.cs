using ECommerce.DataAccess.Entity;

namespace ECommerce.Business.Services.Abstract
{
    public interface IWorkerService
    {
        Task<List<Worker>> GetAllWorkers();
        Task<Worker?> GetWorkerById(int id);
        Task<Worker?> GetWorkerByStoreId(int storeId);
        Task<Worker> AddWorker(Worker worker);
        Task<Worker?> UpdateWorker(int id, Worker worker);
        Task<bool> DeleteWorker(int id);
    }
}
