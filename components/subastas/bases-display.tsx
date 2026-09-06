type BienDisplay = {
  titulo: string
  precioBase: number
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
  className?: string
  titleClassName?: string
  priceClassName?: string
}

export function BasesDisplay({
  bienes,
  precioInicial,
  className = "space-y-3",
  titleClassName = "text-sm text-muted-foreground mb-0.5",
  priceClassName = "text-3xl font-bold text-primary leading-tight",
}: BasesDisplayProps) {
  const items: BienDisplay[] =
    bienes && bienes.length > 0
      ? bienes
      : precioInicial != null && precioInicial > 0
        ? [{ titulo: "Bien", precioBase: precioInicial }]
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
      {items.map((b, i) => (
        <div key={i}>
          <p className={titleClassName}>
            {multi ? b.titulo || `Bien ${i + 1}` : "Base"}
          </p>
          <p className={priceClassName}>{formatPrecio(b.precioBase)}</p>
        </div>
      ))}
    </div>
  )
}
