using api.Application.Interfaces;
using api.Infrastructure.Persistence;
using api.Infrastructure.Services;
using dotenv.net;
using Microsoft.EntityFrameworkCore;
using api.Domain.Interfaces;
using api.Infrastructure.Persistence.Repositories;

DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

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
    try 
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Console.WriteLine("Đang đợi MySQL khởi động (5s)...");
        Thread.Sleep(5000); 
        db.Database.Migrate();
        Console.WriteLine("Migration thành công!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Lỗi Migration: {ex.Message}");
    }
}

app.Run();