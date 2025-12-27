using CadastroPessoas.Api.Models;

namespace CadastroPessoas.Api.Dtos;

public static class DtoMapping
{
    public static PersonResponseDto ToDto(this Person person)
    {
        return new PersonResponseDto
        {
            Id = person.Id,
            Name = person.Name,
            Age = person.Age,
            Transactions = person.Transactions
                .OrderBy(t => t.CreatedAt)
                .Select(t => t.ToDto())
                .ToList()
        };
    }

    public static TransactionResponseDto ToDto(this PersonTransaction transaction)
    {
        return new TransactionResponseDto
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Amount = transaction.Amount,
            CreatedAt = transaction.CreatedAt,
            Type = transaction.Type.ToString(),
            CategoryId = transaction.CategoryId,
            CategoryDescription = transaction.Category.Description,
            CategoryPurpose = transaction.Category.Purpose.ToString()
        };
    }

    public static CategoryResponseDto ToDto(this Category category)
    {
        return new CategoryResponseDto
        {
            Id = category.Id,
            Description = category.Description,
            Purpose = category.Purpose.ToString()
        };
    }
}
