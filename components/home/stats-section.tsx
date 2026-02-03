const stats = [
  { value: "500+", label: "Matriculados Activos" },
  { value: "50+", label: "Años de Trayectoria" },
  { value: "1000+", label: "Subastas Anuales" },
  { value: "18", label: "Departamentos Cubiertos" },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-primary-foreground">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
