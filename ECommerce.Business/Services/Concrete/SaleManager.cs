using ECommerce.Business.Services.Abstract;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ECommerce.DataAccess.Entity.Dtos;



namespace ECommerce.Business.Services.Concrete
{
    public class SaleManager : ISaleService
    {
        private readonly ISaleRepository _saleRepository;
        private readonly ICartService _cartService;
        private readonly IStockRepository _stockRepository;

        public SaleManager(ISaleRepository saleRepository, ICartService cartService, IStockRepository stockRepository)
        {
            _saleRepository = saleRepository;
            _cartService = cartService;
            _stockRepository = stockRepository;
        }

        public async Task CompleteSale(SaleRequestDto saleDto)
        {
            foreach (var item in saleDto.Items)
            {
                var stock = await _stockRepository.DecreaseStock(item.StockId, item.Quantity);
                if (stock == null)
                    throw new InvalidOperationException("Yeterli stok yok veya stok bulunamadı.");
            }

            var sale = new Sale
            {
                CustomerId = saleDto.CustomerId,
                TotalPrice = saleDto.TotalPrice,
                SaleDate = saleDto.SaleDate,
                Status = "Sipariş Alındı",
                SaleItems = saleDto.Items.Select(item => new SaleItem
                {
                    ProductId = item.ProductId,
                    StoreId = item.StoreId,
                    StockId = item.StockId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                }).ToList()
            };

            _saleRepository.Add(sale);
            _saleRepository.Save();

            sale.SaleNo = $"SAL-{sale.Id}";
            _saleRepository.Save();

            _cartService.ClearCart(saleDto.CustomerId);
        }

        public IEnumerable<SaleListDto> GetSalesByCustomerId(int customerId)
        {
            return _saleRepository.GetSalesByCustomerId(customerId)
                .OrderByDescending(s => s.SaleDate)
                .Select(s => new SaleListDto
                {
                    Id = s.Id,
                    SaleNo = s.SaleNo,
                    Status = s.Status,
                    SaleDate = s.SaleDate,
                    TotalPrice = s.TotalPrice
                })
                .ToList();
        }

        public Sale GetById(int id)
        {
            return _saleRepository.GetById(id);
        }

        public IEnumerable<SaleItem> GetSaleItems(int saleId)
        {
            return _saleRepository.GetSaleItems(saleId);
        }

        public IEnumerable<ReturnListDto> GetReturnsByCustomerId(int customerId)
        {
            return _saleRepository.GetReturnsByCustomerId(customerId);
        }

        // Tüm satışları getir (admin için)
        public IEnumerable<SaleListDto> GetAllSales()
        {
            return _saleRepository.GetAllSales()
                .OrderByDescending(s => s.SaleDate)
                .Select(s => new SaleListDto
                {
                    Id = s.Id,
                    SaleNo = s.SaleNo,
                    Status = s.Status,
                    SaleDate = s.SaleDate,
                    TotalPrice = s.TotalPrice,
                    CustomerName = s.Customer != null ? s.Customer.Name + " " + s.Customer.Surname : ""
                    // ItemCount = ... // <-- Bunu tamamen silin
                })
                .ToList();
        }

        public async Task<bool> UpdateSaleStatusAsync(int saleId, string status)
        {
            var sale = await _saleRepository.GetByIdAsync(saleId);
            if (sale == null)
                return false;

            sale.Status = status;
            await _saleRepository.UpdateAsync(sale);
            return true;
        }

        public async Task<string?> GetSaleStatusAsync(int saleId)
        {
            var sale = await _saleRepository.GetByIdAsync(saleId);
            return sale?.Status;
        }
    }
}
