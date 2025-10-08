using Microsoft.EntityFrameworkCore;
using Npgsql;
using Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Custom services

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controllers
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseRouting();

// app.UseAuthorization(); // optional for now

app.MapControllers();


app.Run();
