using ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Entity.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISaleRepository
{
    void Add(Sale sale);
    IEnumerable<Sale> GetSalesByCustomerId(int customerId);
    Sale GetById(int id);
    void Save();
    IEnumerable<SaleItem> GetSaleItems(int saleId);
    IEnumerable<ReturnListDto> GetReturnsByCustomerId(int customerId);

    // Yeni eklenenler:
    IEnumerable<Sale> GetAllSales();
    Task<Sale?> GetByIdAsync(int saleId);
    Task UpdateAsync(Sale sale);
    int GetTotalSaleCount();

}
