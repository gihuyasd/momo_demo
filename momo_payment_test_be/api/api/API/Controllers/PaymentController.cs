using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Interfaces;
using api.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.WebAPI.Controllers;

[ApiController]
[Route("api/payment")]  
public class PaymentController : ControllerBase
{
    private readonly IMomoService _momo;
    private readonly IPaymentRepository _repo;

    public PaymentController(
        IMomoService momo,
        IPaymentRepository repo)
    {
        _momo = momo;
        _repo = repo;
    }

    [HttpPost("create-url")]
    public async Task<IActionResult> Create([FromBody] PaymentRequest req)
    {
        var result = await _momo.CreatePaymentUrlAsync(req);
        return string.IsNullOrEmpty(result.PayUrl) ? BadRequest(result.Message) : Ok(result);
    }

    [HttpPost("ipn")]
    public async Task<IActionResult> ReceiveIpn([FromBody] Dictionary<string, string> data)
    {
        if (!_momo.VerifyIpnSignature(data)) return BadRequest("Invalid Signature");

        if (data["resultCode"] == "0")
        {
            var transId = data["transId"];

            if (!await _repo.ExistsAsync(transId))
            {
                var newPayment = new Payment
                {
                    PaymentID = transId,
                    amount = int.Parse(data["amount"]), 
                    content = data["orderInfo"],       
                    CreatedAt = DateTime.Now
                };

                await _repo.AddAsync(newPayment);
            }
        }

        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPayments()
    {
        var payments = await _repo.GetAllAsync();
        return Ok(payments);
    }
}