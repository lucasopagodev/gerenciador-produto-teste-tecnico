namespace GerenciadorProduto.Infrastructure.Time;

public static class BrazilDateTime
{
    private static readonly TimeZoneInfo TimeZone = ResolveTimeZone();

    public static DateTime UtcNow()
    {
        return DateTime.UtcNow;
    }

    public static DateTimeOffset ToSaoPaulo(DateTime utcDateTime)
    {
        var normalizedUtc = utcDateTime.Kind == DateTimeKind.Utc
            ? utcDateTime
            : DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);

        var localDateTime = TimeZoneInfo.ConvertTimeFromUtc(normalizedUtc, TimeZone);
        return new DateTimeOffset(localDateTime, TimeZone.GetUtcOffset(localDateTime));
    }

    public static DateTimeOffset? ToSaoPaulo(DateTime? utcDateTime)
    {
        return utcDateTime.HasValue ? ToSaoPaulo(utcDateTime.Value) : null;
    }

    private static TimeZoneInfo ResolveTimeZone()
    {
        foreach (var id in new[] { "America/Sao_Paulo", "E. South America Standard Time" })
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(id);
            }
            catch (TimeZoneNotFoundException)
            {
            }
            catch (InvalidTimeZoneException)
            {
            }
        }

        return TimeZoneInfo.Local;
    }
}
