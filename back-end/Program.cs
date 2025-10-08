using Microsoft.EntityFrameworkCore;
using Npgsql;
using Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Custom services

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // redirects from http to https
app.UseRouting();

// app.UseAuthentication(); // optional. Will need do define a service for it to work
// app.UseAuthorization(); // optional.

app.MapControllers();


app.Run();
