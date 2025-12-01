using ECommerce.DataAccess.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ECommerce.DataAccess.Entity;


namespace ECommerce.Business.Services.Abstract
{
    public interface IReportService
    {
        int GetTodayOrderCount();
        decimal GetTodayRevenue();
        int GetTodayApprovedReturnCount(); // yeni eklendi
                                           // Diğer metotlar...
        IEnumerable<CriticalStockDto> GetCriticalStockProducts(int threshold = 10);
        IEnumerable<TopSellingProductDto> GetTopSellingProducts(int days);
        // IReportService.cs
        decimal GetWeeklySalesAmount(DateTime startDate, DateTime endDate);
        decimal GetLastWeekSalesAmount(DateTime startDate, DateTime endDate);

        int GetProductCount();
        int GetStoreCount();

        IEnumerable<SaleNotificationDto> GetRecentSaleNotifications(int count = 5);
        IEnumerable<SalesReturnsChartDto> GetWeeklySalesReturnsChart(DateOnly weekStart);
        void TransferStock(int fromStoreId, int toStoreId, int productId, int quantity);

        IEnumerable<ProductDto> GetAllProducts();
        IEnumerable<StockTransfer> GetTransferHistory();
        IEnumerable<Stock> GetAllStocks();
        IEnumerable<Store> GetAllStores();

    }


}
