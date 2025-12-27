namespace CadastroPessoas.Api.Dtos;

public record TotalsSummaryResponseDto
{
    public decimal TotalReceitas { get; init; }
    public decimal TotalDespesas { get; init; }
    public decimal Saldo { get; init; }
}
