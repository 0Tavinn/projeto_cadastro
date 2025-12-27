namespace CadastroPessoas.Api.Dtos;

public record PersonResponseDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public int Age { get; init; }
    public List<TransactionResponseDto> Transactions { get; init; } = new();
}
