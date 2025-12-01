using ECommerce.DataAccess.Entity.Dtos;
using ECommerce.DataAccess.Entity.ECommerce.DataAccess.Entity;
using System.Collections.Generic;

public interface IReturnService
{
    void CreateReturn(ReturnRequestDto dto);
    IEnumerable<Return> GetReturnsByCustomerId(int customerId);
    Return GetById(int id);
    IEnumerable<ReturnAdminDto> GetAllReturns();
    void ApproveReturn(int id);
    void RejectReturn(int id);
    IEnumerable<Return> GetApprovedReturnsByDateRange(DateOnly startDate, DateOnly endDate);
    double GetReturnRate();


}
