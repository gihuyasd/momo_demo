using api.Application.DTOs;

namespace api.Application.Interfaces;

public interface IMomoService
{
    Task<MomoLinkResponse> CreatePaymentUrlAsync(PaymentRequest request);
    bool VerifyIpnSignature(Dictionary<string, string> data);
}