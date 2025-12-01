using ECommerce.DataAccess.Entity.Dtos;
using ECommerce.DataAccess.Entity.ECommerce.DataAccess.Entity;
using ECommerce.DataAccess.Repository.Abstract;
using System.Collections.Generic;
using System.Linq;

public class ReturnManager : IReturnService
{
    private readonly IReturnRepository _returnRepository;
    private readonly ISaleRepository _saleRepository;


    public ReturnManager(IReturnRepository returnRepository, ISaleRepository saleRepository)
    {
        _returnRepository = returnRepository;
        _saleRepository = saleRepository;
    }

    public void CreateReturn(ReturnRequestDto dto)
    {
        // Aynı SaleId için daha önce iade talebi var mı kontrol et
        var existingReturn = _returnRepository.GetAll()
            .FirstOrDefault(r => r.SaleId == dto.SaleId);

        if (existingReturn != null)
        {
            throw new InvalidOperationException("Bu sipariş için zaten bir iade talebi mevcut.");
        }

        var entity = new Return
        {
            SaleId = dto.SaleId,
            CustomerId = dto.CustomerId,
            ProductId = dto.ProductId,
            ReturnDate = dto.ReturnDate,
            ReturnReason = dto.ReturnReason,
            ReturnStatus = "Pending",
            ReturnCode = Guid.NewGuid().ToString().Substring(0, 8)
        };
        _returnRepository.Add(entity);
        _returnRepository.Save();
    }


    public IEnumerable<Return> GetReturnsByCustomerId(int customerId)
    {
        return _returnRepository.GetByCustomerId(customerId);
    }

    public Return GetById(int id)
    {
        return _returnRepository.GetAll().FirstOrDefault(r => r.Id == id);
    }

    // Admin işlemleri
    public IEnumerable<ReturnAdminDto> GetAllReturns()
    {
        return _returnRepository.GetAll()
            .Select(r => new ReturnAdminDto
            {
                Id = r.Id,
                ProductName = r.Product?.Name,
                CustomerName = r.Customer != null ? $"{r.Customer.Name} {r.Customer.Surname}" : "",
                saleNo = r.Sale?.SaleNo ?? r.SaleId.ToString(), // SaleNo varsa onu, yoksa SaleId
                ReturnDate = r.ReturnDate,
                ReturnReason = r.ReturnReason,
                ReturnStatus = r.ReturnStatus
            });
    }


    public void ApproveReturn(int id)
    {
        _returnRepository.ApproveAsync(id).Wait();
    }
    public void RejectReturn(int id)
    {
        _returnRepository.RejectAsync(id).Wait();
    }
    public IEnumerable<Return> GetApprovedReturnsByDateRange(DateOnly startDate, DateOnly endDate)
    {
        return _returnRepository.GetApprovedReturnsByDateRange(startDate, endDate);
    }
    public double GetReturnRate()
    {
        int totalReturns = _returnRepository.GetTotalReturnCount();
        int totalSales = _saleRepository.GetTotalSaleCount();
        if (totalSales == 0) return 0;
        return (double)totalReturns / totalSales;
    }

}
