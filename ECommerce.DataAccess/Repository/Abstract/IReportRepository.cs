using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Entity.Dtos;


namespace ECommerce.DataAccess.Repository.Abstract
{
    public interface IReportRepository
    {
        int GetTodayOrderCount();
        decimal GetTodayRevenue(); // yeni eklendi
                                   // Diğer metotlar...
        int GetTodayApprovedReturnCount(); // yeni eklendi
        IEnumerable<CriticalStockDto> GetCriticalStockProducts(int threshold = 10);
        IEnumerable<TopSellingProductDto> GetTopSellingProducts(int days);
        // IReportRepository.cs
        decimal GetWeeklySalesAmount(DateTime startDate, DateTime endDate);
        decimal GetLastWeekSalesAmount(DateTime startDate, DateTime endDate);
        int GetProductCount();
        int GetStoreCount();
        IEnumerable<SaleNotificationDto> GetRecentSaleNotifications(int count = 5);
        IEnumerable<Sale> GetSalesBetweenDates(DateOnly start, DateOnly end);
        IEnumerable<Return> GetApprovedReturnsBetweenDates(DateOnly start, DateOnly end);
        void TransferStock(int fromStoreId, int toStoreId, int productId, int quantity);

        IEnumerable<ProductDto> GetAllProducts();
        IEnumerable<StockTransfer> GetTransferHistory();
        IEnumerable<Stock> GetAllStocks();
        IEnumerable<Store> GetAllStores();








    }

}
