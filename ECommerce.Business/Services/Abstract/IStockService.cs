using System.Collections.Generic;
using System.Threading.Tasks;
using ECommerce.DataAccess.Entity;


public interface IStockService
{
    Task<List<Stock>> GetAllStocks();
    Task<Stock?> GetStockById(int id);
    Task<Stock> AddStock(Stock stock);
    Task<Stock?> UpdateStock(int id, Stock stock);
    Task<bool> DeleteStock(int id);
    Task<Stock?> DecreaseStock(int id, int decreaseAmount);
    Task<bool> TransferStock(int productId, int fromStoreId, int toStoreId, int quantity);
    Task<List<StockTransfer>> GetTransfers(int? productId = null, int? storeId = null);
    Task<List<Stock>> GetStocksForStore(int storeId, List<int> productIds);

}
