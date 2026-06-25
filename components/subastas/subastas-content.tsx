"use client"

import { useEffect, useState, useMemo } from "react"
import type { SubastaResponse, MatriculadoPublicResponse } from "@/lib/api"
import { getSubastasPublicas, getMatriculadosPublicos } from "@/lib/api"
import { matriculaPuedeEjercer } from "@/lib/estado-fianza"
import { SubastasFilter } from "./subastas-filter"
import { SubastasList } from "./subastas-list"

export function SubastasContent() {
  const [subastas, setSubastas] = useState<SubastaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filterEstado, setFilterEstado] = useState<string>("proximas")

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [subastasApi, padron] = await Promise.all([
          getSubastasPublicas(),
          getMatriculadosPublicos(),
        ])

        if (cancelled) return

        const estadoMap = new Map<string, MatriculadoPublicResponse>()
        padron.forEach((m) =>
          estadoMap.set(m.matricula.toUpperCase(), m)
        )

        const filtradas = subastasApi.filter((s) => {
          const m = estadoMap.get(s.martilleroACargo.toUpperCase())
          if (!m) return true // si no lo encontramos, no filtramos
          return matriculaPuedeEjercer(m)
        })

        setSubastas(filtradas)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (filterEstado === "todas") return subastas
    const today = new Date().toISOString().slice(0, 10)
    if (filterEstado === "proximas") {
      return subastas.filter((s) => s.fechaFin >= today)
    }
    return subastas.filter((s) => s.fechaFin < today)
  }, [subastas, filterEstado])

  return (
    <>
      <SubastasFilter
        value={filterEstado}
        onValueChange={setFilterEstado}
        disabled={loading}
      />
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          Cargando edictos...
        </div>
      ) : (
        <SubastasList subastas={filtered} />
      )}
    </>
  )
}
