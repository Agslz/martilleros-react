"use client"

import { useEffect, useState, useMemo } from "react"
import type { SubastaResponse } from "@/lib/api"
import { getSubastasPublicas } from "@/lib/api"
import { SubastasFilter } from "./subastas-filter"
import { SubastasList } from "./subastas-list"

export function SubastasContent() {
  const [subastas, setSubastas] = useState<SubastaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filterEstado, setFilterEstado] = useState<string>("proximas")

  useEffect(() => {
    let cancelled = false
    getSubastasPublicas().then((data) => {
      if (!cancelled) {
        setSubastas(data)
        setLoading(false)
      }
    })
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
          Cargando subastas...
        </div>
      ) : (
        <SubastasList subastas={filtered} />
      )}
    </>
  )
}
