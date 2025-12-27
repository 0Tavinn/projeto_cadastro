namespace CadastroPessoas.Api.Dtos;

public record TotalsResponseDto
{
    public List<PersonTotalsResponseDto> People { get; init; } = new();
    public TotalsSummaryResponseDto Overall { get; init; } = new();
}
