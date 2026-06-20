# Guía de uso del sistema web — Colegio de Martilleros de Mendoza

**Para:** comisión directiva, administración del Colegio y matriculados.  
**Versión:** mayo 2026

Esta guía describe cómo usar el sitio tal como está implementado hoy. No requiere conocimientos técnicos.

---

## ¿Qué es este sistema?

Un sitio web con tres partes:

1. **Sitio público** — cualquier persona puede consultar el padrón, edictos y datos de contacto.
2. **Panel del matriculado** — cada martillero matriculado ingresa con su matrícula y contraseña para trámites propios.
3. **Panel de administración** — personal autorizado del Colegio gestiona matriculados, edictos, fianzas, cuotas y contenidos.

---

## Parte 1 — Sitio público (sin usuario ni contraseña)

### 1.1 Portada

- Dirección: página principal del sitio (`Inicio` en el menú).
- Muestra información institucional, accesos rápidos y novedades visuales.
- Desde el menú superior puede ir a las demás secciones.

### 1.2 Padrón de asociados (buscar matriculados)

**Menú → Padrón de asociados** (o **Buscar**).

1. Escriba un **apellido** (opcional) y pulse buscar.
2. Verá una lista con nombre, matrícula y si el profesional está **habilitado** para ejercer.
3. **Habilitado** significa: matriculado activo por el Colegio **y** fianza en regla.

También existe la página **Matriculados** con listado completo y filtros (todos / habilitados / no habilitados).

### 1.3 Edictos

**Menú → Edictos**.

- Listado de subastas/edictos publicados.
- Solo aparecen publicaciones de martilleros **habilitados** (según padrón del Colegio).
- Al abrir un edicto verá detalle: título, fechas, lugar, martillero a cargo, imágenes y texto del edicto.

> Socios y no socios pueden publicar edictos a través de los canales que el Colegio habilite (publicación externa vía administración o matriculado desde su panel).

### 1.4 Contacto

**Menú → Contacto**.

- Columna derecha: **datos de contacto** del Colegio (dirección, teléfono, horarios). El administrador puede actualizarlos desde el panel admin (ver sección 3.7).
- Formulario “Envíenos un mensaje”: en la versión actual está preparado para derivar la consulta por **WhatsApp** (pendiente configurar el número oficial del Colegio en el sistema).

### 1.5 Acceso matriculados

**Botón “Acceso Matriculados”** (esquina superior) → pantalla de **inicio de sesión**.

---

## Parte 2 — Matriculado (panel privado)

### 2.1 Primera vez que ingresa

Cuando el Colegio da de alta un matriculado, recibe **matrícula** y **contraseña temporal** (por correo o por el Colegio).

1. Entrar a **Acceso Matriculados**.
2. Ingresar **matrícula** y **contraseña temporal**.
3. El sistema lo llevará a **Completar perfil**:
   - Correo electrónico.
   - **Contraseña actual** (la temporal con la que entró).
   - **Contraseña nueva** (mínimo 8 caracteres) y confirmación.
   - CUIT (opcional).
4. Al guardar, ya puede usar el panel con su nueva contraseña.

### 2.2 Ingreso habitual

1. **Acceso Matriculados** → matrícula + contraseña.
2. Entra al **Panel** (menú lateral izquierdo).

Si olvidó la contraseña: enlace **Olvidé mi contraseña** → ingrese su **matrícula** → el sistema envía una contraseña temporal al **email registrado** (debe tener email cargado en el Colegio).

### 2.3 Mi estado

**Panel → Mi estado** (primera opción del menú).

Muestra:

- Si está **habilitado** por el Colegio.
- Estado de la **fianza** (activa, vencida, pendiente, no requerida).
- Si **puede ejercer** (habilitado + fianza activa).

### 2.4 Fianzas

**Panel → Fianzas**.

1. Complete **fecha de inicio** y **fecha de vencimiento** de la constancia.
2. Adjunte el **PDF** de la constancia de fianza.
3. Envíe.

El Colegio **revisará** el archivo en administración. Hasta que no sea aprobada, la fianza no quedará activa. Puede ver el historial de constancias enviadas.

> El pago o renovación de la fianza con la aseguradora se gestiona **fuera** de esta web; aquí solo se **presenta la constancia**.

### 2.5 Subastas / edictos (matriculado)

**Panel → Subastas**.

- Ver sus publicaciones.
- **Nueva subasta:** completar título, descripción, precios, fechas, domicilio, texto de edicto, etc. Los datos del martillero salen de su perfil.
- Puede adjuntar **imágenes**.

Las publicaciones quedan visibles en el sitio público (Edictos) si el matriculado está habilitado.

### 2.6 Cuotas

**Panel → Cuotas**.

- Lista de **períodos** (ej. cada mes) con estado: **Pendiente**, **Pagado** o **Vencido**.
- Hoy es solo **consulta**. El pago en línea (Pagos360) se habilitará cuando el Colegio active esa integración.
- Para abonar por transferencia u otro medio, siga las instrucciones que indique el Colegio por los canales habituales.

### 2.7 Biblioteca

**Panel → Biblioteca**.

- Documentos PDF que el Colegio compartió con matriculados (normativa, formularios, etc.).
- Descarga o apertura según el enlace de cada documento.

### 2.8 Mi perfil

**Panel → Mi perfil**.

- Actualizar **nombre**, **apellido**, **email**, **CUIT** (si el backend lo permite).
- **Cambiar contraseña:** contraseña actual, nueva (mín. 8 caracteres) y confirmación.

### 2.9 Cerrar sesión

Botón **Cerrar sesión** en el menú lateral del panel.

---

## Parte 3 — Administración del Colegio

Solo usuarios con rol **administrador**. Acceso por la misma pantalla **Acceso Matriculados**, con matrícula de admin y contraseña.

### 3.1 Sesión de administrador (importante)

- **Un solo administrador a la vez:** si alguien ya está en el panel, otro admin verá aviso de panel ocupado. Puede **forzar el acceso** si está coordinado con la comisión.
- **Inactividad:** si no usa el sistema durante un tiempo (configurado en el servidor, por defecto ~30 minutos), la sesión se cierra sola.
- **Cerrar sesión** al terminar, desde el menú lateral.

### 3.2 Panel principal

Al ingresar llega al **Panel** admin con accesos a todas las secciones.

### 3.3 Matriculados

**Admin → Matriculados**

**Buscar y filtrar**

1. Escriba **apellido** (opcional) y pulse **Buscar**.
2. Filtre por **Todos / Habilitados / Deshabilitados**.
3. **Limpiar** restablece los filtros.

**Listado**

- Matrícula, nombre, estado (habilitado para ejercer / no habilitado / tema fianza).
- **Habilitar** o **Deshabilitar** según corresponda (no es lo mismo que la fianza: un matriculado puede estar habilitado por el Colegio pero sin fianza activa).

**Alta de nuevo matriculado**

**Admin → Nuevo matriculado**

1. Complete nombre, apellido, DNI, matrícula, email, CUIT.
2. Opcional: foto de carnet.
3. Guarde. El sistema genera **contraseña temporal**; comuníquela al matriculado de forma segura.
4. En el **primer login** deberá completar perfil y cambiar contraseña (sección 2.1).

### 3.4 Verificación de fianzas

**Admin → Verificación de fianzas**

1. Revise la lista de constancias **pendientes**.
2. **Ver archivo:** abre el PDF enviado por el matriculado.
3. **Habilitar (aprobar):** si la constancia es correcta → el matriculado queda con fianza **activa** (y puede ejercer si además está habilitado).
4. **Rechazar / notificar:** envía correo al matriculado con el motivo; no habilita la fianza.

### 3.5 Subastas (publicaciones externas y gestión)

**Admin → Subastas**

- Listado de publicaciones.
- **Nueva:** para edictos de **terceros no matriculados** o publicaciones administradas por el Colegio (publicación externa).
- **Editar** solo publicaciones marcadas como externas.
- Cargar imágenes y datos del edicto según el formulario.

Los matriculados cargan sus propias subastas desde **su** panel (Parte 2.5).

### 3.6 Cuotas

**Admin → Cuotas**

**Crear un período (mes a cobrar)**

1. En “Crear período” ingrese:
   - **Período** en formato `AAAA-MM` (ej. `2026-05`).
   - **Monto** de la cuota.
   - **Fecha de vencimiento**.
2. Pulse **Crear período**.

**Ver quién pagó**

1. En “Estado por período” escriba el mismo período (`2026-05`).
2. Pulse **Consultar**.
3. Tabla con matrícula, nombre, **estado** (PAGADO / PENDIENTE / VENCIDO) y fecha de pago si corresponde.

> **Nota:** la lista muestra matriculados que ya tienen registro de cuota para ese mes. Si alguien nunca ingresó a “Mis cuotas”, puede no aparecer hasta que el sistema genere su fila. Para un control “15 matriculados, 8 pagaron”, conviene que todos hayan sido dados de alta y, si hace falta, que entren una vez a Cuotas o que el Colegio defina un proceso con el área técnica.

**Pago en línea:** pendiente de Pagos360; hoy el cobro se registra por los procesos que defina el Colegio (transferencia, etc.) y eventual actualización en el sistema cuando exista integración o carga manual.

### 3.7 Contenidos del sitio

**Admin → Contenidos**

Pestañas:

| Pestaña | Qué hace hoy |
|---------|----------------|
| **CONTACTO** | **Sí se ve en el sitio** — footer de todas las páginas y página Contacto. Edite título y cuerpo (puede usar HTML simple). |
| **HOME** | Se guarda en base de datos pero **no cambia la portada** todavía (textos fijos del diseño). |
| **TEXTOS** | Igual: editable aquí, **sin uso visible** en el sitio por ahora. |

Para actualizar teléfono, dirección u horarios visibles al público, use **CONTACTO**.

### 3.8 Biblioteca

**Admin → Biblioteca**

- Subir documentos PDF para matriculados.
- Indicar si son visibles en el panel de matriculados.
- Editar o eliminar documentos existentes.

---

## Parte 4 — Resumen de roles

| Acción | Público | Matriculado | Admin |
|--------|---------|-------------|-------|
| Buscar en el padrón | Sí | Sí | Sí |
| Ver edictos | Sí | Sí | Sí |
| Publicar edicto propio | No | Sí | Sí (externa) |
| Subir fianza | No | Sí | Aprueba |
| Ver / pagar cuota en web | No | Consulta | Crea período y ve estado |
| Dar de alta matriculado | No | No | Sí |
| Editar contacto del sitio | No | No | Sí (CONTACTO) |

---

## Parte 5 — Preguntas frecuentes

**¿Dónde pago la cuota por internet?**  
Por ahora solo puede **ver** el estado en Panel → Cuotas. El pago online se anunciará cuando esté activo Pagos360.

**¿La fianza se paga por la web?**  
No. Se **sube la constancia** en PDF; el pago es con la aseguradora u otro medio externo.

**¿Por qué un matriculado no aparece como habilitado en el padrón?**  
Puede estar deshabilitado por el Colegio o no tener fianza **activa** aprobada.

**¿Dos administradores pueden trabajar a la vez?**  
No en la misma sesión global; deben coordinarse o usar “forzar acceso”.

**¿Cómo cambio los textos de la página de inicio?**  
Hoy requiere cambio en el diseño web o una decisión del Colegio sobre usar la pestaña HOME en Contenidos (pendiente).

---

## Soporte técnico

Para incidencias del sistema (errores, accesos, integración con backend), contacte al equipo de desarrollo con:

- Descripción del problema y captura de pantalla.
- Matrícula o usuario afectado (sin enviar contraseñas por mail).
- Hora aproximada del incidente.

Documentación técnica para el equipo de TI: **`docs/DOCUMENTACION_TECNICA.md`**.

---

*Colegio de Martilleros Públicos y Corredores de Comercio de Mendoza — Sistema web.*
