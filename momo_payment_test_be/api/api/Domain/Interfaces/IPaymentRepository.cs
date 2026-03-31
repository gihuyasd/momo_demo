using api.Domain.Models;

namespace api.Domain.Interfaces;
public interface IPaymentRepository
{
    Task AddAsync(Payment payment);
    Task<bool> ExistsAsync(string paymentId);
    Task<List<Payment>> GetAllAsync();
}