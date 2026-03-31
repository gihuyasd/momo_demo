using api.Domain.Interfaces;
using api.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Persistence.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _context;

    public PaymentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Payment payment)
    {
        await _context.Payments.AddAsync(payment);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(string paymentId)
    {
        return await _context.Payments.AnyAsync(p => p.PaymentID == paymentId);
    }
    public async Task<List<Payment>> GetAllAsync()
    {
        return await _context.Payments.ToListAsync();
    }
}