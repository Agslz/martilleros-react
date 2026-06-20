# Documentación técnica — Sitio web Colegio de Martilleros (Mendoza)

**Versión:** mayo 2026  
**Repositorio:** `martilleros-react` (Next.js) + `cm-backend` (Spring Boot API)

---

## 1. Arquitectura general

```
┌─────────────────┐     HTTPS/JSON      ┌──────────────────────┐
│  Navegador      │ ◄─────────────────► │  cm-backend          │
│  Next.js 16     │   Bearer JWT        │  Spring Boot /api    │
│  (este repo)    │                     │  PostgreSQL, S3, mail │
└─────────────────┘                     └──────────────────────┘
```

- **Frontend:** aplicación React con App Router de Next.js. Renderizado mixto (Server Components en páginas públicas; Client Components en formularios y paneles).
- **Backend:** API REST bajo prefijo `/api`. Autenticación JWT en rutas privadas y admin.
- **Fuente de verdad del contrato API:** `cm-backend/FRONTEND_API_DOCUMENTACION.md` y Swagger (`/swagger-ui.html`) del backend desplegado.

---

## 2. Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS, componentes Radix/shadcn |
| Lenguaje | TypeScript |
| HTTP cliente | `fetch` encapsulado en `lib/api/client.ts` |
| Node | >= 20.9.0 |

Scripts: `npm run dev` | `npm run build` | `npm run start` | `npm run lint`

---

## 3. Variables de entorno

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | Base de la API (ej. `http://localhost:8080/api` o URL de producción) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (SEO, sitemap, Open Graph) |

Definir en `.env.local` (no commitear secretos).

---

## 4. Estructura del proyecto (frontend)

```
martilleros-react/
├── app/                    # Rutas (App Router)
│   ├── page.tsx            # Portada pública
│   ├── buscar/             # Búsqueda matriculados
│   ├── matriculados/       # Padrón público
│   ├── edictos/            # Listado y detalle de edictos/subastas
│   ├── contacto/
│   ├── login/
│   ├── completar-perfil/
│   ├── olvide-contrasena/
│   ├── panel/              # Área matriculado (autenticado)
│   └── admin/              # Área administración (rol ADMIN)
├── components/             # UI por dominio (home, subastas, auth, layout…)
├── lib/
│   ├── api/                # Cliente HTTP y funciones por módulo
│   ├── estado-fianza.ts    # Etiquetas y regla puedeEjercer
│   ├── storage-url.ts      # URLs S3 vs /api/dev/files (local)
│   ├── admin-session.ts    # Sesión única admin + inactividad
│   └── site.ts             # URL canónica del sitio
├── public/images/          # Assets estáticos (hero, estandarte, etc.)
├── docs/                   # Documentación (este archivo + guía usuario)
├── ESTADO_PROYECTO.md      # Checklist integración / pendientes
├── SETUP.md                # Instalación local
└── README.md
```

---

## 5. Mapa de rutas

### 5.1 Sitio público (sin login)

| Ruta | Descripción |
|------|-------------|
| `/` | Portada (hero, servicios, institucional). Textos en código; no usa contenido HOME del CMS. |
| `/buscar` | Búsqueda de matriculados por apellido |
| `/matriculados` | Listado del padrón con filtros |
| `/edictos` | Edictos/subastas publicadas (solo martilleros habilitados con fianza activa) |
| `/edictos/[id]` | Detalle de edicto |
| `/contacto` | Formulario (mock / pendiente WhatsApp) + datos CONTACTO del CMS |
| `/login` | Acceso matriculados y administradores |
| `/olvide-contrasena` | Recuperación por matrícula (email en BD) |
| `/completar-perfil` | Primer login matriculado |

### 5.2 Panel matriculado (`/panel/*`)

Requiere JWT de matriculado. Menú lateral:

| Ruta | API principal |
|------|----------------|
| `/panel` | `GET /private/matriculados/estado` |
| `/panel/subastas` | `GET /private/subastas` |
| `/panel/subastas/nueva` | `POST /private/subastas` (+ imágenes) |
| `/panel/fianzas` | `GET/POST /private/fianzas` |
| `/panel/cuotas` | `GET /private/cuotas` |
| `/panel/biblioteca` | `GET /private/biblioteca` |
| `/panel/perfil` | `GET/PUT /auth/me`, `POST /auth/cambiar-contrasena` |

### 5.3 Panel administración (`/admin/*`)

Requiere JWT con rol `ADMIN`. Sesión única e inactividad configurable desde backend.

| Ruta | API principal |
|------|----------------|
| `/admin` | Dashboard enlaces |
| `/admin/subastas` | CRUD publicaciones externas |
| `/admin/subastas/nueva`, `/[id]/editar` | `POST/PUT /admin/subastas/publicacion-externa` |
| `/admin/biblioteca` | CRUD documentos PDF |
| `/admin/verificacion-fianzas` | Fianzas pendientes, aprobar, rechazar por mail |
| `/admin/matriculados` | Listado con filtros, habilitar/deshabilitar |
| `/admin/matriculados/nuevo` | Alta matriculado (+ foto opcional) |
| `/admin/contenidos` | `PUT /admin/contenidos/{key}` — HOME, CONTACTO, TEXTOS |
| `/admin/cuotas` | Períodos y estado por matriculado |

---

## 6. Autenticación y sesiones

### Login

- `POST /auth/login` — body: `{ matricula, password }`, opcional `force` (admin).
- Respuesta: `token`, `role`, `primeraVezLogin`, datos de usuario.
- Token guardado en `localStorage` (clave gestionada en `lib/api/auth.ts`).

### Flujos post-login

| Rol | Condición | Destino |
|-----|-----------|---------|
| ADMIN | — | `/admin` |
| Matriculado | `primeraVezLogin === true` | `/completar-perfil` |
| Matriculado | resto | `/panel` |

### Admin — sesión única

- Si otro admin ya tiene sesión activa → HTTP **409**; UI ofrece “forzar acceso”.
- `AdminInactivityMonitor`: cierre por inactividad (minutos desde `adminInactivityTimeoutMinutes`, default 30).
- Logout: `POST /auth/logout` + limpieza local.

### Completar perfil / contraseña

- `POST /auth/completar-perfil`: `email`, `contrasenaActual`, `nuevaContrasena`, `cuit?`
- `POST /auth/cambiar-contrasena`: `contrasenaActual`, `nuevaContrasena`

---

## 7. Módulos funcionales (integración API)

### 7.1 Matriculados

- Público: `GET /public/matriculados?apellido=`
- Privado estado: `GET /private/matriculados/estado` → `EstadoMatriculadoResponse`
- Admin: `GET /admin/matriculados?apellido=&habilitado=`, `PUT /admin/matriculados/{id}`, `POST /admin/matriculados`

**Regla de negocio en front:** `puedeEjercer = habilitado && estadoFianza === 'ACTIVA'` (`lib/estado-fianza.ts`).  
Estados de fianza: `ACTIVA`, `VENCIDA`, `PENDIENTE`, `NO_REQUERIDA`.

### 7.2 Fianzas

- Matriculado sube PDF: `POST /private/fianzas` (multipart).
- Admin: `GET /admin/fianzas/pendientes`, `POST .../aprobar`, `POST .../notificar-rechazo`.
- URLs de constancia: `lib/storage-url.ts` — URL absoluta (S3) o `/api/dev/files/...` solo en local.

### 7.3 Edictos / subastas

- Público: `GET /public/subastas`, detalle por id.
- Matriculado: creación con datos del perfil (sin campos martillero duplicados en body).
- Admin: **publicación externa** para no matriculados (`esPublicacionExterna`); edición solo en esas publicaciones.
- Imágenes: multipart; PDF de edicto lo genera Boletín Oficial (no `urlBoletinOficial` en front).

### 7.4 Cuotas

- Matriculado: `GET /private/cuotas` — períodos y estado (`PENDIENTE` / `PAGADO` / `VENCIDO`).
- Admin: `POST /admin/cuotas/periodos`, `GET /admin/cuotas/estado?periodo=YYYY-MM`.
- **No** Mercado Pago en front. Pagos360 pendiente en backend.
- Módulo legacy `/private/pagos` **no usado** — fuera de alcance; solicitar baja en backend.

### 7.5 Biblioteca

- Matriculado: lectura de documentos visibles.
- Admin: alta/edición/baja/upload PDF.

### 7.6 Contenidos CMS

- Claves: `HOME`, `CONTACTO`, `TEXTOS`.
- **Solo `CONTACTO`** se consume en sitio (footer + `/contacto`).
- `HOME` / `TEXTOS`: editables en admin pero no enlazados a la portada (pendiente definición cliente).

---

## 8. Capa `lib/api`

| Archivo | Responsabilidad |
|---------|-----------------|
| `config.ts` | `API_BASE_URL` |
| `client.ts` | `apiRequest`, `apiRequestFormData`, manejo 401 |
| `auth.ts` | login, logout, perfil, contraseñas |
| `matriculados.ts` | búsqueda pública |
| `private-matriculados.ts` | estado matriculado |
| `admin-matriculados.ts` | CRUD admin matriculados |
| `fianzas.ts` / `admin-fianzas.ts` | fianzas |
| `subastas.ts` / `admin-subastas.ts` | edictos |
| `cuotas.ts` | cuotas |
| `contenidos.ts` / `admin-contenidos.ts` | CMS |
| `biblioteca.ts` | biblioteca |
| `types.ts` | DTOs TypeScript alineados al backend |

Patrón de respuesta: `ApiResponse<T>` con `success`, `data`, `message`.

---

## 9. SEO y archivos estáticos

- `app/sitemap.ts`, `app/robots.ts`
- `components/seo/site-json-ld.tsx`
- Metadata por página en `layout.tsx` / `page.tsx`

---

## 10. Despliegue (referencia)

1. Build: `npm run build`
2. Servir: `npm run start` o plataforma (Vercel, etc.)
3. Configurar `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_SITE_URL` en el entorno de producción
4. Backend con CORS permitiendo el origen del front
5. Storage en producción: URLs absolutas S3 en respuestas de archivos

---

## 11. Pendientes técnicos conocidos

Ver **`ESTADO_PROYECTO.md`** (checklist vivo). Resumen:

- Contenidos HOME/TEXTOS en portada (decisión cliente)
- Contacto: enlace WhatsApp con número oficial
- Pagos360 para pago online de cuotas
- Eliminar módulo `pagos` del backend (acordado fuera de alcance front)
- Mejoras opcionales cuotas admin (resumen X/Y, alta masiva PENDIENTE)

---

## 12. Documentos relacionados

| Documento | Audiencia |
|-----------|-----------|
| `docs/GUIA_USUARIO.md` | Cliente / operadores del Colegio |
| `ESTADO_PROYECTO.md` | Equipo de desarrollo — estado integración |
| `SETUP.md` | Desarrollo local |
| `cm-backend/FRONTEND_API_DOCUMENTACION.md` | Contrato API completo |
