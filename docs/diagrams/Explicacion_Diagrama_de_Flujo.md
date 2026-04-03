# Diagrama de Flujo — Agrogestión

## 1. Introducción

El presente documento describe el diagrama de flujo del sistema **Agrogestión**, detallando los procesos principales de la aplicación: autenticación, navegación por rol, ciclo de vida de las tareas y asignación de trabajadores. Cada sección del diagrama se organiza secuencialmente para ilustrar cómo interactúan los diferentes actores con el sistema.

---

## 2. Sección 1 — Flujo de Autenticación

### 2.1. Punto de entrada

El flujo comienza en la **Landing Page**, una página pública con información general sobre la aplicación. Desde allí, el usuario puede elegir entre dos acciones: **Registro** o **Login**.

### 2.2. Registro de usuario

1. El usuario accede al **Formulario de Registro**, donde introduce sus datos personales:
   - Nombre y apellidos
   - Email
   - DNI
   - Teléfono
   - Dirección
   - Rol deseado (Gerente, Capataz o Trabajador)

2. Se invoca **`Supabase Auth signUp()`**, que crea el usuario en la tabla `auth.users`.

3. Un **trigger de PostgreSQL** (`handle_new_user()`) se ejecuta automáticamente y crea la fila correspondiente en la tabla `perfiles` con los datos del formulario.

4. El usuario queda autenticado y se redirige según su rol.

### 2.3. Inicio de sesión (Login)

1. El usuario accede al **Formulario de Login** e introduce email y contraseña.

2. Se invoca **`Supabase Auth signInWithPassword()`**, que valida las credenciales.

3. Se obtiene la **sesión JWT** y se carga el **perfil del usuario** desde la base de datos mediante la función `get_my_role`.

4. Ambas rutas (registro y login) convergen en el nodo de decisión **¿Rol del usuario?**, desde donde se redirige al panel correspondiente.

---

## 3. Sección 2 — Navegación por Rol

Tras la autenticación, el sistema redirige al usuario a un panel específico según su rol. Cada panel tiene funcionalidades diferenciadas:

### 3.1. Panel ADMIN (`/admin`)

El administrador tiene acceso al **dashboard de estadísticas** y a la **gestión completa de usuarios**:

- Ver estadísticas globales (total de usuarios, tareas, terrenos, registros mensuales).
- Editar datos de cualquier usuario.
- Cambiar el rol de un usuario.
- Dar de baja o reactivar usuarios (soft delete).

### 3.2. Panel GERENTE (`/gerente`)

El gerente gestiona los recursos agrícolas:

- **Terrenos**: Crear, editar y dar de baja parcelas de cultivo.
- **Tareas**: Crear nuevas tareas, asignar capataz responsable. Cada tarea muestra un indicador 💬 con el número de comentarios.
- **Comentarios**: Ver y añadir comentarios en las tareas para comunicarse con capataces y trabajadores.
- **Mi Equipo**: Asociar y desasociar capataces de su equipo.

### 3.3. Panel CAPATAZ (`/capataz`)

El capataz ejecuta y supervisa las tareas:

- **Campanita de notificaciones 🔔**: En la cabecera se muestra un icono de campana con el contador de notificaciones no leídas. Al pulsar, se abre un modal con el historial de notificaciones donde se pueden marcar como leídas individual o colectivamente.
- **Mis Tareas**: Ver las tareas asignadas por el gerente, cambiar el estado (Aceptar, En Progreso, Completar). Cada tarea muestra un indicador 💬 con el número de comentarios.
- **Asignar Trabajadores**: Vincular trabajadores de su equipo a las tareas.
- **Mi Equipo**: Asociar y desasociar trabajadores.
- **Comentarios**: Añadir comentarios en las tareas para comunicación con el equipo.

### 3.4. Panel TRABAJADOR (`/trabajador`)

El trabajador tiene el panel más sencillo:

- **Campanita de notificaciones 🔔**: En la cabecera se muestra un icono de campana con el contador de notificaciones no leídas. Al pulsar, se abre un modal con el historial donde se pueden marcar como leídas.
- **Mis Tareas**: Ver las tareas a las que ha sido asignado. Cada tarea muestra un indicador 💬 con el número de comentarios.
- **Aceptar / Rechazar**: Responder a las asignaciones de tareas.
- **Comentarios**: Ver y añadir comentarios en las tareas asignadas.

---

## 4. Sección 3 — Ciclo de Vida de la Tarea (Estados)

Cada tarea sigue una máquina de estados lineal con una posible rama de rechazo:

```
PENDIENTE → ASIGNADA → ACEPTADA → EN_PROGRESO → COMPLETADA
                  ↓
             RECHAZADA
```

### 4.1. PENDIENTE

Estado inicial. El **gerente crea la tarea** sin asignar capataz. La tarea queda en espera.

### 4.2. ASIGNADA

El **gerente asigna un capataz** a la tarea. El capataz recibe la tarea en su panel.

### 4.3. ACEPTADA / RECHAZADA

El **capataz revisa la tarea** y decide:
- **Aceptar**: La tarea pasa a estado ACEPTADA y el capataz puede comenzar a trabajar en ella.
- **Rechazar**: La tarea pasa a estado RECHAZADA. El gerente deberá reasignar o modificar la tarea.

### 4.4. EN_PROGRESO

El **capataz marca la tarea como en progreso**, indicando que se está ejecutando activamente en el terreno.

### 4.5. COMPLETADA

El **capataz marca la tarea como completada** cuando el trabajo ha finalizado. Este es el estado final del ciclo.

---

## 5. Sección 4 — Flujo de Asignación de Trabajadores a Tareas

Este flujo describe cómo los capataces asignan trabajadores de su equipo a tareas específicas:

### 5.1. Proceso paso a paso

1. El **capataz selecciona un trabajador** de su equipo y una **tarea** de las que tiene asignadas.

2. Se realiza un **INSERT en la tabla `tarea_trabajador`** con estado inicial `PENDIENTE`.

3. Un **trigger de PostgreSQL** (`notificar_trabajador_asignado()`) se ejecuta automáticamente y crea una **notificación** en la tabla `notificaciones`, alertando al trabajador de la nueva asignación.

4. El **trabajador** ve la notificación en su panel y **responde**:
   - **Acepta**: El estado de la asignación cambia a `ACEPTADA` en `tarea_trabajador`.
   - **Rechaza**: El estado cambia a `RECHAZADA`, y el capataz deberá asignar otro trabajador.

### 5.2. Diagrama del proceso

```
Capataz selecciona    →    INSERT en           →    ¿Trabajador     →  ACEPTADA
trabajador y tarea         tarea_trabajador          responde?      →  RECHAZADA
                                ↓
                    Trigger: notificar_trabajador_asignado()
                    → INSERT en notificaciones
```

---

## 6. Simbología del diagrama

El diagrama de flujo utiliza la notación estándar:

| Forma | Color | Significado |
|-------|-------|-------------|
| **Elipse** | Verde / Rojo | Inicio y Fin del proceso |
| **Rectángulo redondeado** | Azul | Acción del usuario (formularios, páginas) |
| **Rombo** | Amarillo | Punto de decisión |
| **Rectángulo redondeado** | Morado | Operación de backend (Supabase, triggers) |
| **Rectángulo redondeado** | Rojo/Verde/Azul/Amarillo | Paneles y acciones específicas por rol |

---

## 7. Tecnologías involucradas en el flujo

| Componente | Tecnología | Función |
|-----------|------------|---------|
| Frontend | React 19 + TypeScript | SPA con enrutamiento por rol (`react-router-dom`) |
| Autenticación | Supabase Auth | JWT, `signUp()`, `signInWithPassword()` |
| Base de datos | PostgreSQL (Supabase) | 10 tablas con RLS (Row Level Security) |
| Triggers | PL/pgSQL | `handle_new_user()`, `notificar_trabajador_asignado()` |
| Estado global | Zustand (`useAuthStore`) | Sesión y perfil del usuario autenticado |
| Internacionalización | i18next | Soporte para español, inglés y rumano |
