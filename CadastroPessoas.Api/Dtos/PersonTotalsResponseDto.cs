namespace CadastroPessoas.Api.Dtos;

public record PersonTotalsResponseDto
{
    public Guid PersonId { get; init; }
    public string Name { get; init; } = string.Empty;
    public decimal TotalReceitas { get; init; }
    public decimal TotalDespesas { get; init; }
    public decimal Saldo { get; init; }
}
