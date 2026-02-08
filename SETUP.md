# Cómo hacer correr el proyecto

## Requisito: Node.js 20 o superior

Este proyecto usa **Next.js 16**, que requiere **Node.js >= 20.9.0**.  
Tu sistema tiene Node **14.15.1**, que es insuficiente (por eso aparece `Cannot find module 'node:events'`).

---

## Instalar Node.js en Windows

### Opción 1: Instalador oficial (recomendado)

1. Entrá a **https://nodejs.org**
2. Descargá la versión **LTS** (recomendado: 20.x o 22.x)
3. Ejecutá el instalador y completá los pasos (podés dejar las opciones por defecto)
4. **Cerrando y volviendo a abrir** la terminal (o Cursor), verificá:
   ```powershell
   node --version
   ```
   Deberías ver algo como `v20.x.x` o `v22.x.x`.

### Opción 2: nvm-windows (varias versiones de Node)

Si querés poder cambiar de versión de Node según el proyecto:

1. Descargá **nvm-windows** desde: https://github.com/coreybutler/nvm-windows/releases  
   (archivo `nvm-setup.exe`)
2. Instalalo y en una terminal nueva ejecutá:
   ```powershell
   nvm install 20
   nvm use 20
   node --version
   ```

---

## Después de instalar Node 20+

En la carpeta del proyecto:

```powershell
cd c:\Users\Agustin\Documents\GitHub\martilleros-react
npm install
npm run dev
```

La app quedará en **http://localhost:3000**.

---

## Gestor de paquetes (opcional)

El proyecto tiene `pnpm-lock.yaml`. Si preferís usar **pnpm**:

```powershell
npm install -g pnpm
pnpm install
pnpm dev
```

Si usás solo **npm**, con `npm install` y `npm run dev` alcanza.

---

## Conectar con el backend (login y API)

El frontend llama al backend en **http://localhost:8080/api** por defecto.

### 1. Backend en marcha

El backend (Spring Boot) debe estar corriendo en **http://localhost:8080**.  
Probá en Postman: `POST http://localhost:8080/api/auth/login` con body `{ "matricula": "MAT-001", "password": "Test123!" }`.

### 2. CORS en el backend

El navegador bloquea peticiones desde **http://localhost:3000** (Next.js) hacia **http://localhost:8080** si el backend no permite ese origen.

En el backend (cm-backend) tené que permitir el origen del frontend:

- **Variable de entorno:** `CORS_ORIGINS=http://localhost:3000`  
  o, si ya tenés otro origen: `CORS_ORIGINS=http://localhost:4200,http://localhost:3000`
- **O en `application-local.yml`** (o el perfil que uses):  
  `cors.allowed-origins: http://localhost:3000`

Reiniciá el backend después de cambiar CORS. Si no, al hacer login desde el navegador vas a ver un error de red o "Failed to fetch".

### 3. Credenciales de prueba

Según la colección de Postman:

- **Matriculado:** matrícula `MAT-001`, contraseña `Test123!`
- **Admin:** matrícula `ADMIN001`, contraseña `Admin123!`

### 4. Cambiar la URL del backend

Si el backend corre en otro puerto o dominio, creá `.env.local` en la raíz del proyecto:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Reemplazá por la URL que uses (por ejemplo en producción).
