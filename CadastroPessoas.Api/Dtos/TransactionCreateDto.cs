namespace CadastroPessoas.Api.Dtos;

public record TransactionCreateDto(string Description, decimal Amount, string Type, Guid CategoryId);
