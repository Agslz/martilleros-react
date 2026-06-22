import Image from "next/image"

type MiembroComision = {
  /** Archivo en public/images/comision/{id}.png */
  id: string
  nombre: string
  cargo: string
}

function getMiembroImage(miembro: MiembroComision) {
  return `/images/comision/${miembro.id}.png`
}

type GrupoComision = {
  titulo: string
  miembros: MiembroComision[]
}

const GRUPOS_COMISION: GrupoComision[] = [
  {
    titulo: "Comisión directiva",
    miembros: [
      {
        id: "silvia-andrea-legrand",
        nombre: "Silvia Andrea Legrand",
        cargo: "Presidente",
      },
      {
        id: "elias-vaquer",
        nombre: "Elias Vaquer",
        cargo: "Vicepresidente",
      },
      {
        id: "patricia-maturano",
        nombre: "Patricia Maturano",
        cargo: "Secretaría",
      },
      {
        id: "fanny-maldonado",
        nombre: "Fanny Maldonado",
        cargo: "Pro-secretaría",
      },
      {
        id: "luis-duarte",
        nombre: "Luis Duarte",
        cargo: "Tesorero",
      },
      {
        id: "victor-adalberto-belarde",
        nombre: "Victor Adalberto Belarde",
        cargo: "Pro-tesorero",
      },
    ],
  },
  {
    titulo: "Vocales titulares",
    miembros: [
      {
        id: "jorge-medel",
        nombre: "Jorge Medel",
        cargo: "Vocal titular",
      },
      {
        id: "roberto-kollenberger",
        nombre: "Roberto Kollenberger",
        cargo: "Vocal titular",
      },
    ],
  },
  {
    titulo: "Vocales suplentes",
    miembros: [
      {
        id: "magdalena-aguero",
        nombre: "Magdalena Agüero",
        cargo: "Vocal suplente",
      },
      {
        id: "gerardo-schelfthout",
        nombre: "Gerardo Schelfthout",
        cargo: "Vocal suplente",
      },
      {
        id: "branko-molinari",
        nombre: "Branko Molinari",
        cargo: "Vocal suplente",
      },
    ],
  },
  {
    titulo: "Tribunal de ética",
    miembros: [
      {
        id: "javier-paniagua-y-correa",
        nombre: "Javier Paniagua y Correas",
        cargo: "Tribunal de ética",
      },
      {
        id: "aldo-santos-maza",
        nombre: "Aldo Santos Maza",
        cargo: "Tribunal de ética",
      },
      {
        id: "victor-hugo-daccurzio",
        nombre: "Victor Hugo D'Accurzio",
        cargo: "Tribunal de ética",
      },
    ],
  },
  {
    titulo: "Tribunal de cuentas",
    miembros: [
      {
        id: "nestor-buseta",
        nombre: "Néstor Buseta",
        cargo: "Tribunal de cuentas",
      },
      {
        id: "susana-campos",
        nombre: "Susana Campos",
        cargo: "Tribunal de cuentas",
      },
    ],
  },
]

function MiembroCard({ miembro }: { miembro: MiembroComision }) {
  return (
    <li className="flex">
      <article className="flex w-full flex-col items-center text-center rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:border-primary/25 hover:shadow-md transition-all">
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/15 ring-offset-2 ring-offset-card">
          <Image
            src={getMiembroImage(miembro)}
            alt={`Foto de ${miembro.nombre}`}
            fill
            sizes="(max-width: 640px) 112px, 128px"
            className="object-cover"
            unoptimized
          />
        </div>
        <h3 className="mt-5 font-semibold text-foreground text-base sm:text-lg leading-snug">
          {miembro.nombre}
        </h3>
        <p className="mt-1.5 text-sm font-medium text-primary">{miembro.cargo}</p>
      </article>
    </li>
  )
}

export function CommissionSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-background border-y border-border"
      aria-labelledby="comision-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center lg:mx-0 lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Autoridades
          </p>
          <h2
            id="comision-heading"
            className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance"
          >
            Comisión directiva y órganos del Colegio
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Integrantes de la comisión directiva, vocales y tribunales que
            representan y administran los intereses de los martilleros y
            corredores matriculados en Mendoza.
          </p>
        </div>

        <div className="mt-14 space-y-14 lg:space-y-16">
          {GRUPOS_COMISION.map((grupo) => (
            <div key={grupo.titulo}>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground text-center lg:text-left">
                {grupo.titulo}
              </h3>
              <ul
                className={[
                  "mt-6 grid grid-cols-1 min-[480px]:grid-cols-2 gap-6 lg:gap-5",
                  grupo.miembros.length >= 6
                    ? "lg:grid-cols-3 xl:grid-cols-6"
                    : grupo.miembros.length === 3
                      ? "lg:grid-cols-3"
                      : "lg:grid-cols-2 xl:grid-cols-3",
                ].join(" ")}
              >
                {grupo.miembros.map((miembro) => (
                  <MiembroCard key={miembro.id} miembro={miembro} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
