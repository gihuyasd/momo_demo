using api.Application.Interfaces;
using api.Infrastructure.Persistence;
using api.Infrastructure.Services;
using dotenv.net;
using Microsoft.EntityFrameworkCore;
using api.Domain.Interfaces;
using api.Infrastructure.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";

var serverVersion = new MySqlServerVersion(new Version(8, 0, 31));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, serverVersion, mysqlOptions => {
        mysqlOptions.EnableRetryOnFailure(
            maxRetryCount: 10,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    }));

builder.Services.AddHttpClient<IMomoService, MomoService>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(frontendUrl) 
              .AllowAnyMethod()         
              .AllowAnyHeader()          
              .AllowCredentials();       
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

app.UseCors("CorsPolicy");

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try 
    {
        var db = services.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
        Console.WriteLine("--- Migration thành công! ---");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--- Lỗi Migration: {ex.Message} ---");
        if (ex.InnerException != null) 
            Console.WriteLine($"--- Chi tiết: {ex.InnerException.Message} ---");
    }
}

app.Run();