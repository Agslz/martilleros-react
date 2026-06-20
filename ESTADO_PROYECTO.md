# Estado del proyecto — martilleros-react

Última actualización: mayo 2026.

**Documentación**

| Documento | Para quién |
|-----------|------------|
| [`docs/GUIA_USUARIO.md`](./docs/GUIA_USUARIO.md) | Cliente / operadores — paso a paso |
| [`docs/DOCUMENTACION_TECNICA.md`](./docs/DOCUMENTACION_TECNICA.md) | Desarrollo / TI |
| [`SETUP.md`](./SETUP.md) | Instalación local |
| `cm-backend/FRONTEND_API_DOCUMENTACION.md` | Contrato API |

---

## Resumen

Front Next.js integrado con el backend del Colegio de Martilleros. Integración casi completa en auth, matriculados, fianzas, edictos, biblioteca, cuotas (sin Mercado Pago) y contenido CONTACTO.

---

## Checklist de integración

| # | Tema | Estado |
|---|------|--------|
| 1 | Cuotas: sin Mercado Pago; listado + aviso Pagos360 próximamente | **Hecho** |
| 2 | Fianzas admin: URLs constancia (S3 / `dev/files` solo local) | **Hecho** |
| 3 | Completar perfil y cambiar contraseña | **Hecho** |
| 4 | Tipos alineados (`EstadoFianza`, estado matriculado, etc.) | **Hecho** |
| 5 | Admin matriculados: filtros apellido / habilitado | **Hecho** |
| 6 | Contenidos HOME/TEXTOS en portada | **Pendiente cliente** |
| 7 | Módulo `/private/pagos` | **Fuera de alcance** — baja en backend |
| 8 | Contacto vía WhatsApp | **Pendiente** — número oficial + botón |

---

## Pendientes breves

- **HOME/TEXTOS:** conectar a portada o quitar pestañas admin (decisión cliente).
- **WhatsApp:** `wa.me` en formulario de contacto.
- **Cuotas:** Pagos360; mejoras admin opcionales (resumen X/Y).
- **Backend:** eliminar módulo `pagos` obsoleto.

---

## Rutas principales

| Área | Rutas |
|------|--------|
| Público | `/`, `/buscar`, `/matriculados`, `/edictos`, `/contacto`, `/login` |
| Matriculado | `/panel`, `/panel/subastas`, `/panel/fianzas`, `/panel/cuotas`, `/panel/biblioteca`, `/panel/perfil` |
| Admin | `/admin`, `/admin/matriculados`, `/admin/subastas`, `/admin/verificacion-fianzas`, `/admin/cuotas`, `/admin/contenidos`, `/admin/biblioteca` |
