type BienDisplay = {
  titulo: string
  precioBase: number
  incremento?: number | null
}

function formatPrecio(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

type BasesDisplayProps = {
  bienes?: BienDisplay[] | null
  /** Compat si no hay array bienes */
  precioInicial?: number
  /** Incremento a nivel edicto (solo 1 bien) */
  incrementos?: number | null
  className?: string
  titleClassName?: string
  priceClassName?: string
}

export function BasesDisplay({
  bienes,
  precioInicial,
  incrementos,
  className = "space-y-3",
  titleClassName = "text-sm text-muted-foreground mb-0.5",
  priceClassName = "text-3xl font-bold text-primary leading-tight",
}: BasesDisplayProps) {
  const items: BienDisplay[] =
    bienes && bienes.length > 0
      ? bienes
      : precioInicial != null && precioInicial > 0
        ? [{ titulo: "Bien", precioBase: precioInicial, incremento: incrementos }]
        : []

  if (!items.length) {
    return (
      <div className={className}>
        <p className={titleClassName}>Base</p>
        <p className={priceClassName}>—</p>
      </div>
    )
  }

  const multi = items.length > 1

  return (
    <div className={className}>
      {items.map((b, i) => {
        const inc =
          multi
            ? b.incremento
            : b.incremento != null && b.incremento > 0
              ? b.incremento
              : incrementos

        return (
          <div key={i} className={i > 0 ? "pt-3 border-t border-border/60" : undefined}>
            <p className={titleClassName}>
              {multi ? b.titulo || `Bien ${i + 1}` : "Base"}
            </p>
            <p className={priceClassName}>{formatPrecio(b.precioBase)}</p>
            {inc != null && Number(inc) > 0 && (
              <div className="mt-2">
                <p className={titleClassName}>
                  {multi ? "Incremento" : "Incrementos"}
                </p>
                <p className="text-xl font-semibold text-foreground leading-tight">
                  {formatPrecio(Number(inc))}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
