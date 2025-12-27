using CadastroPessoas.Api.Data;
using CadastroPessoas.Api.Dtos;
using CadastroPessoas.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend",
        policy =>
        {
            if (allowedOrigins.Length > 0)
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            }
            else
            {
                policy.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            }
        });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("frontend");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var databaseCreator = db.Database.GetService<IRelationalDatabaseCreator>();
    var hasTables = databaseCreator.HasTables();

    if (!hasTables)
    {
        db.Database.Migrate();
    }
}

app.MapGet("/api/people", async (AppDbContext db) =>
{
    var people = await db.People
        .Include(p => p.Transactions)
        .ThenInclude(t => t.Category)
        .ToListAsync();

    return Results.Ok(people.Select(p => p.ToDto()));
});

app.MapGet("/api/people/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var person = await db.People
        .Include(p => p.Transactions)
        .ThenInclude(t => t.Category)
        .FirstOrDefaultAsync(p => p.Id == id);

    return person is null ? Results.NotFound() : Results.Ok(person.ToDto());
});

app.MapPost("/api/people", async (PersonCreateDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Name))
    {
        return Results.BadRequest("Name is required.");
    }

    if (dto.Age <= 0)
    {
        return Results.BadRequest("Age must be a positive integer.");
    }

    var person = new Person
    {
        Id = Guid.NewGuid(),
        Name = dto.Name.Trim(),
        Age = dto.Age
    };

    db.People.Add(person);
    await db.SaveChangesAsync();

    return Results.Created($"/api/people/{person.Id}", person.ToDto());
});

app.MapDelete("/api/people/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var person = await db.People.Include(p => p.Transactions).FirstOrDefaultAsync(p => p.Id == id);
    if (person is null)
    {
        return Results.NotFound();
    }

    db.People.Remove(person);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapGet("/api/people/{id:guid}/transactions", async (Guid id, AppDbContext db) =>
{
    var transactions = await db.Transactions
        .Include(t => t.Category)
        .Where(t => t.PersonId == id)
        .OrderBy(t => t.CreatedAt)
        .ToListAsync();

    if (!transactions.Any())
    {
        var exists = await db.People.AnyAsync(p => p.Id == id);
        return exists ? Results.Ok(Array.Empty<TransactionResponseDto>()) : Results.NotFound();
    }

    return Results.Ok(transactions.Select(t => t.ToDto()));
});

app.MapPost("/api/people/{id:guid}/transactions", async (Guid id, TransactionCreateDto dto, AppDbContext db) =>
{
    if (dto.Amount <= 0)
    {
        return Results.BadRequest("Amount must be greater than zero.");
    }

    if (string.IsNullOrWhiteSpace(dto.Description))
    {
        return Results.BadRequest("Description is required.");
    }

    var type = dto.Type?.Trim().ToLowerInvariant() switch
    {
        "despesa" => TransactionType.Despesa,
        "receita" => TransactionType.Receita,
        _ => (TransactionType?)null
    };

    if (type is null)
    {
        return Results.BadRequest("Type must be despesa or receita.");
    }

    var person = await db.People.FirstOrDefaultAsync(p => p.Id == id);
    if (person is null)
    {
        return Results.NotFound();
    }

    if (person.Age < 18 && type == TransactionType.Receita)
    {
        return Results.BadRequest("Pessoas menores de 18 anos só podem registrar despesas.");
    }

    var category = await db.Categories.FirstOrDefaultAsync(c => c.Id == dto.CategoryId);
    if (category is null)
    {
        return Results.BadRequest("Categoria não encontrada.");
    }

    if (type == TransactionType.Despesa && category.Purpose == CategoryPurpose.Receita)
    {
        return Results.BadRequest("Categoria de receita não pode ser usada em despesa.");
    }

    if (type == TransactionType.Receita && category.Purpose == CategoryPurpose.Despesa)
    {
        return Results.BadRequest("Categoria de despesa não pode ser usada em receita.");
    }

    var transaction = new PersonTransaction
    {
        Id = Guid.NewGuid(),
        PersonId = id,
        CategoryId = category.Id,
        Description = dto.Description.Trim(),
        Amount = dto.Amount,
        CreatedAt = DateTime.UtcNow,
        Type = type.Value,
        Category = category
    };

    db.Transactions.Add(transaction);
    await db.SaveChangesAsync();

    return Results.Created($"/api/people/{id}/transactions/{transaction.Id}", transaction.ToDto());
});

app.MapGet("/api/categories", async (AppDbContext db) =>
{
    var categories = await db.Categories
        .OrderBy(c => c.Description)
        .ToListAsync();

    return Results.Ok(categories.Select(c => c.ToDto()));
});

app.MapPost("/api/categories", async (CategoryCreateDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Description))
    {
        return Results.BadRequest("Description is required.");
    }

    CategoryPurpose? purpose = dto.Purpose?.Trim().ToLowerInvariant() switch
    {
        "despesa" => CategoryPurpose.Despesa,
        "receita" => CategoryPurpose.Receita,
        "ambas" => CategoryPurpose.Ambas,
        _ => null
    };

    if (purpose is null)
    {
        return Results.BadRequest("Purpose must be one of: despesa, receita, ambas.");
    }

    var category = new Category
    {
        Id = Guid.NewGuid(),
        Description = dto.Description.Trim(),
        Purpose = purpose.Value
    };

    db.Categories.Add(category);
    await db.SaveChangesAsync();

    return Results.Created($"/api/categories/{category.Id}", category.ToDto());
});

app.MapGet("/api/people/totals", async (AppDbContext db) =>
{
    var perPerson = await db.People
        .Select(p => new PersonTotalsResponseDto
        {
            PersonId = p.Id,
            Name = p.Name,
            TotalReceitas = p.Transactions
                .Where(t => t.Type == TransactionType.Receita)
                .Select(t => (decimal?)t.Amount)
                .Sum() ?? 0m,
            TotalDespesas = p.Transactions
                .Where(t => t.Type == TransactionType.Despesa)
                .Select(t => (decimal?)t.Amount)
                .Sum() ?? 0m,
            Saldo = 0m
        })
        .ToListAsync();

    var perPersonWithSaldo = perPerson
        .Select(p => p with { Saldo = p.TotalReceitas - p.TotalDespesas })
        .ToList();

    var overall = new TotalsSummaryResponseDto
    {
        TotalReceitas = perPersonWithSaldo.Sum(p => p.TotalReceitas),
        TotalDespesas = perPersonWithSaldo.Sum(p => p.TotalDespesas),
        Saldo = perPersonWithSaldo.Sum(p => p.Saldo)
    };

    var response = new TotalsResponseDto
    {
        People = perPersonWithSaldo,
        Overall = overall
    };

    return Results.Ok(response);
});

app.Run();