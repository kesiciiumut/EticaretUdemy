using System.Collections.Generic;
using System.Threading.Tasks;
using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Entity.Dtos;



public interface ISaleService
{
    Task CompleteSale(SaleRequestDto saleDto);
    IEnumerable<SaleListDto> GetSalesByCustomerId(int customerId);
    Sale GetById(int id);
    IEnumerable<SaleItem> GetSaleItems(int saleId);
    IEnumerable<ReturnListDto> GetReturnsByCustomerId(int customerId);

    // Yeni eklenenler:
    IEnumerable<SaleListDto> GetAllSales();
    Task<bool> UpdateSaleStatusAsync(int saleId, string status);
    Task<string?> GetSaleStatusAsync(int saleId);
}
