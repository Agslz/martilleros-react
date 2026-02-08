"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout/public-layout"
import { BuscarHeader } from "@/components/buscar/buscar-header"
import { BuscarForm } from "@/components/buscar/buscar-form"
import { BuscarResults } from "@/components/buscar/buscar-results"
import { getMatriculadosPublicos } from "@/lib/api"
import type { MatriculadoPublicResponse } from "@/lib/api"

export default function BuscarPage() {
  const [results, setResults] = useState<MatriculadoPublicResponse[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (apellido: string, matricula: string) => {
    setLoading(true)
    setSearched(true)
    setResults(null)
    try {
      let list = await getMatriculadosPublicos(apellido || undefined)
      if (matricula.trim()) {
        const mat = matricula.trim().toUpperCase()
        list = list.filter(
          (m) =>
            m.matricula.toUpperCase().includes(mat) ||
            m.matricula.toUpperCase() === mat
        )
      }
      setResults(list)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <BuscarHeader />
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <BuscarForm onSearch={handleSearch} loading={loading} />
          <BuscarResults
            results={results}
            loading={loading}
            searched={searched}
          />
        </div>
      </section>
    </PublicLayout>
  )
}
