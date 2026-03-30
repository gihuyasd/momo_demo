namespace api.Application.DTOs
{
    public record PaymentRequest(string OrderId, long Amount, string OrderInfo);
    public record MomoLinkResponse(string PayUrl, string Message);
}
