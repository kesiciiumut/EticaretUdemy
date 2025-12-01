using ECommerce.Business.Services.Abstract;
using ECommerce.DataAccess.Entity.Dtos;
using ECommerce.DataAccess.Repository.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;
using ECommerce.DataAccess.Entity;



namespace ECommerce.Business.Services.Concrete
{
    public class ReportManager : IReportService
    {
        private readonly IReportRepository _reportRepository;

        public ReportManager(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        public int GetTodayOrderCount()
        {
            return _reportRepository.GetTodayOrderCount();
        }

        public decimal GetTodayRevenue()
        {
            return _reportRepository.GetTodayRevenue();
        }

        public int GetTodayApprovedReturnCount()
        {
            return _reportRepository.GetTodayApprovedReturnCount();
        }


        public IEnumerable<CriticalStockDto> GetCriticalStockProducts(int threshold = 10)
        {
            return _reportRepository.GetCriticalStockProducts(threshold);
        }
        public IEnumerable<TopSellingProductDto> GetTopSellingProducts(int days)
        {
            return _reportRepository.GetTopSellingProducts(days);
        }
        public void TransferStock(int fromStoreId, int toStoreId, int productId, int quantity)
        {
            // İş kuralları burada kontrol edilebilir (örn: loglama, validasyon)
            _reportRepository.TransferStock(fromStoreId, toStoreId, productId, quantity);
        }
        public IEnumerable<ProductDto> GetAllProducts()
        {
            return _reportRepository.GetAllProducts();
        }



        // ReportManager.cs
        public decimal GetWeeklySalesAmount(DateTime startDate, DateTime endDate)
        {
            return _reportRepository.GetWeeklySalesAmount(startDate, endDate);
        }

        public decimal GetLastWeekSalesAmount(DateTime startDate, DateTime endDate)
        {
            return _reportRepository.GetLastWeekSalesAmount(startDate, endDate);
        }
        public int GetProductCount()
        {
            return _reportRepository.GetProductCount();
        }
        public int GetStoreCount()
        {
            return _reportRepository.GetStoreCount();
        }
        public IEnumerable<StockTransfer> GetTransferHistory()
        {
            return _reportRepository.GetTransferHistory();
        }

        public IEnumerable<Stock> GetAllStocks()
        {
            return _reportRepository.GetAllStocks();
        }

        public IEnumerable<SaleNotificationDto> GetRecentSaleNotifications(int count = 5)
        {
            return _reportRepository.GetRecentSaleNotifications(count);
        }

        public IEnumerable<SalesReturnsChartDto> GetWeeklySalesReturnsChart(DateOnly weekStart)
        {
            var sales = _reportRepository.GetSalesBetweenDates(weekStart, weekStart.AddDays(6));
            var returns = _reportRepository.GetApprovedReturnsBetweenDates(weekStart, weekStart.AddDays(6));

            var days = Enumerable.Range(0, 7)
                .Select(i => weekStart.AddDays(i))
                .ToList();

            var result = new List<SalesReturnsChartDto>();

            foreach (var day in days)
            {
                var salesAmount = sales
                    .Where(s => s.SaleDate == day)
                    .Sum(s => s.TotalPrice);

                var returnAmount = returns
                    .Where(r => r.ReturnDate == day)
                    .Sum(r => r.Sale.TotalPrice);

                result.Add(new SalesReturnsChartDto
                {
                    Day = day.ToString("ddd", new CultureInfo("tr-TR")), // "Pzt", "Sal", ...
                    SalesAmount = salesAmount,
                    ReturnAmount = returnAmount
                });
            }

            return result;
        }
        public IEnumerable<Store> GetAllStores()
        {
            return _reportRepository.GetAllStores();
        }



    }






}
