using api.Application.DTOs;
using api.Application.Interfaces;
using System.Security.Cryptography;
using System.Text;
using System.Net.Http.Json;

namespace api.Infrastructure.Services;

public class MomoService : IMomoService
{
    private readonly IConfiguration _config;
    private readonly HttpClient _http;

    public MomoService(IConfiguration config, HttpClient http)
    {
        _config = config;
        _http = http;
    }

    private string CreateSignature(string rawData)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_config["MOMO_SECRET_KEY"] ?? "");
        using var hmac = new HMACSHA256(keyBytes);
        byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawData));
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }

    public async Task<MomoLinkResponse> CreatePaymentUrlAsync(PaymentRequest req)
    {
        var requestId = Guid.NewGuid().ToString();
        var extraData = ""; 

        var rawData = $"accessKey={_config["MOMO_ACCESS_KEY"]}" +
                      $"&amount={req.Amount}" +
                      $"&extraData={extraData}" +
                      $"&ipnUrl={_config["MOMO_IPN_URL"]}" +
                      $"&orderId={req.OrderId}" +
                      $"&orderInfo={req.OrderInfo}" +
                      $"&partnerCode={_config["MOMO_PARTNER_CODE"]}" +
                      $"&redirectUrl={_config["MOMO_REDIRECT_URL"]}" +
                      $"&requestId={requestId}" +
                      $"&requestType=captureWallet";

        var payload = new
        {
            partnerCode = _config["MOMO_PARTNER_CODE"],
            partnerName = "Soccer Field Manager", //
            storeId = "Store001",
            requestId,
            amount = req.Amount,
            orderId = req.OrderId,
            orderInfo = req.OrderInfo,
            redirectUrl = _config["MOMO_REDIRECT_URL"],
            ipnUrl = _config["MOMO_IPN_URL"],
            lang = "vi",
            extraData,
            requestType = "captureWallet",
            signature = CreateSignature(rawData)
        };

        var response = await _http.PostAsJsonAsync(_config["MOMO_API_ENDPOINT"]!, payload);
        var result = await response.Content.ReadFromJsonAsync<dynamic>();

        return new MomoLinkResponse(
            result?.GetProperty("payUrl").GetString() ?? "",
            result?.GetProperty("message").GetString() ?? ""
        );
    }

    public bool VerifyIpnSignature(Dictionary<string, string> data)
    {
        var rawData = $"accessKey={_config["MOMO_ACCESS_KEY"]}" +
                      $"&amount={data["amount"]}" +
                      $"&extraData={data["extraData"]}" +
                      $"&message={data["message"]}" +
                      $"&orderId={data["orderId"]}" +
                      $"&orderInfo={data["orderInfo"]}" +
                      $"&orderType={data["orderType"]}" +
                      $"&partnerCode={data["partnerCode"]}" +
                      $"&payType={data["payType"]}" +
                      $"&requestId={data["requestId"]}" +
                      $"&responseTime={data["responseTime"]}" +
                      $"&resultCode={data["resultCode"]}" +
                      $"&transId={data["transId"]}";

        var calculatedSignature = CreateSignature(rawData);
        return calculatedSignature == data["signature"];
    }
}