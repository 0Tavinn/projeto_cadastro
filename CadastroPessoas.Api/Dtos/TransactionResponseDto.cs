namespace CadastroPessoas.Api.Dtos;

public record TransactionResponseDto
{
    public Guid Id { get; init; }
    public string Description { get; init; } = string.Empty;
    public decimal Amount { get; init; }
    public DateTime CreatedAt { get; init; }
    public string Type { get; init; } = string.Empty;
    public Guid CategoryId { get; init; }
    public string CategoryDescription { get; init; } = string.Empty;
    public string CategoryPurpose { get; init; } = string.Empty;
}
