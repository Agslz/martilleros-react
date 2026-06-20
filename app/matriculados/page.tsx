"use client"

import { useEffect, useState, useMemo } from "react"
import { MatriculadosHeader } from "@/components/matriculados/matriculados-header"
import { MatriculadosSearch } from "@/components/matriculados/matriculados-search"
import { MatriculadosList } from "@/components/matriculados/matriculados-list"
import { matriculaPuedeEjercer } from "@/lib/estado-fianza"
import { getMatriculadosPublicos } from "@/lib/api"
import type { MatriculadoPublicResponse } from "@/lib/api"

/** Excluir del listado público al usuario administrador (ej. matrícula ADMIN001). */
function excluirAdmin(matriculados: MatriculadoPublicResponse[]) {
  return matriculados.filter(
    (m) => !m.matricula.toUpperCase().startsWith("ADMIN")
  )
}

export default function MatriculadosPage() {
  const [list, setList] = useState<MatriculadoPublicResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [apellidoFilter, setApellidoFilter] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")

  const load = (apellido?: string) => {
    setLoading(true)
    getMatriculadosPublicos(apellido?.trim() || undefined)
      .then((data) => setList(excluirAdmin(data)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSearch = (apellido: string) => {
    setApellidoFilter(apellido)
    load(apellido || undefined)
  }

  const filtered = useMemo(() => {
    if (estadoFilter === "todos") return list
    if (estadoFilter === "habilitado") {
      return list.filter(matriculaPuedeEjercer)
    }
    return list.filter((m) => !matriculaPuedeEjercer(m))
  }, [list, estadoFilter])

  return (
    <>
      <MatriculadosHeader />
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MatriculadosSearch
            onSearch={handleSearch}
            loading={loading}
            estadoFilter={estadoFilter}
            onEstadoFilterChange={setEstadoFilter}
          />
          <MatriculadosList
            matriculados={filtered}
            loading={loading}
            totalCount={list.length}
          />
        </div>
      </section>
    </>
  )
}
