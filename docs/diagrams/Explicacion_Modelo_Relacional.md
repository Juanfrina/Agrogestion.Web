# Modelo Relacional — Agrogestión

## 1. Introducción

El presente documento describe el modelo relacional de la base de datos del sistema **Agrogestión**, una aplicación web de gestión agrícola desarrollada como Trabajo de Fin de Grado. La base de datos está alojada en **Supabase** (PostgreSQL) y consta de **10 tablas** organizadas en cuatro categorías funcionales.

---

## 2. Categorías de tablas

El modelo se estructura por colores en el diagrama:

| Color | Categoría | Tablas |
|-------|-----------|--------|
| **Azul** | Catálogos | `rol`, `estados_tarea` |
| **Verde** | Entidades principales | `perfiles`, `tarea`, `terreno` |
| **Naranja** | Tablas de relación (N:M) | `gerente_capataz`, `tarea_trabajador`, `capataz_trabajador` |
| **Morado** | Funcionalidades complementarias | `comentarios_tarea`, `notificaciones` |

---

## 3. Descripción de cada tabla

### 3.1. ROL (catálogo)

Almacena los 4 roles de usuario del sistema.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id_rol` | INTEGER | **PK** |
| `nombre` | VARCHAR(50) | UNIQUE |
| `descripcion` | VARCHAR(255) | — |

**Valores predefinidos:** ADMIN (1), GERENTE (2), CAPATAZ (3), TRABAJADOR (4).

### 3.2. ESTADOS_TAREA (catálogo)

Define los posibles estados por los que pasa una tarea.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id_estado` | SERIAL | **PK** |
| `nombre` | VARCHAR(50) | UNIQUE |
| `descripcion` | VARCHAR(255) | — |

**Valores predefinidos:** PENDIENTE, ASIGNADA, ACEPTADA, RECHAZADA, EN_PROGRESO, COMPLETADA.

### 3.3. PERFILES (entidad principal)

Extiende la tabla `auth.users` de Supabase con los datos de perfil del usuario.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | **PK**, FK → `auth.users` |
| `nombre` | VARCHAR(100) | NOT NULL |
| `apellidos` | VARCHAR(100) | NOT NULL |
| `dni` | VARCHAR(9) | UNIQUE, NOT NULL |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL |
| `tlf` | VARCHAR(15) | NOT NULL |
| `direccion` | VARCHAR(255) | NOT NULL |
| `id_rol` | INTEGER | FK → `rol(id_rol)` |
| `fecha_baja` | DATE | Soft delete |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |

**Nota:** El campo `id` enlaza directamente con el sistema de autenticación de Supabase (`auth.users`), creándose automáticamente mediante un trigger `handle_new_user()`.

### 3.4. TAREA (entidad principal)

Representa las tareas agrícolas creadas por los gerentes.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id_tarea` | SERIAL | **PK** |
| `nombre` | VARCHAR(100) | NOT NULL |
| `descripcion` | TEXT | — |
| `fecha_inicio` | DATE | NOT NULL |
| `fecha_fin` | DATE | NOT NULL |
| `id_terreno` | INTEGER | FK → `terreno(id_terreno)` |
| `id_gerente` | UUID | FK → `perfiles(id)`, NOT NULL |
| `id_capataz` | UUID | FK → `perfiles(id)` |
| `id_estado` | INTEGER | FK → `estados_tarea(id_estado)` |
| `fecha_baja` | DATE | Soft delete |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() |

### 3.5. TERRENO (entidad principal)

Representa las parcelas o terrenos de cultivo gestionados por los gerentes.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id_terreno` | SERIAL | **PK** |
| `nombre` | VARCHAR(100) | NOT NULL |
| `ubicacion` | VARCHAR(255) | NOT NULL |
| `tipo_cultivo` | VARCHAR(100) | — |
| `estado` | VARCHAR(50) | — |
| `id_gestor` | UUID | FK → `perfiles(id)`, NOT NULL |
| `fecha_baja` | DATE | Soft delete |
| `created_at` | TIMESTAMPTZ | DEFAULT now() |

### 3.6. GERENTE_CAPATAZ (relación N:M)

Asocia gerentes con sus capataces asignados.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id_gerente` | UUID | **PK** compuesta, FK → `perfiles(id)` |
| `id_capataz` | UUID | **PK** compuesta, FK → `perfiles(id)` |

### 3.7. CAPATAZ_TRABAJADOR (relación N:M)

Asocia capataces con sus trabajadores asignados.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id_capataz` | UUID | **PK** compuesta, FK → `perfiles(id)` |
| `id_trabajador` | UUID | **PK** compuesta, FK → `perfiles(id)` |

### 3.8. TAREA_TRABAJADOR (relación N:M)

Vincula trabajadores con tareas, incluyendo su estado de asignación individual.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id_tarea` | INTEGER | **PK** compuesta, FK → `tarea(id_tarea)` |
| `id_trabajador` | UUID | **PK** compuesta, FK → `perfiles(id)` |
| `id_capataz` | UUID | FK → `perfiles(id)` |
| `estado` | VARCHAR(20) | DEFAULT 'PENDIENTE' |
| `fecha_asignacion` | TIMESTAMPTZ | DEFAULT now() |

### 3.9. COMENTARIOS_TAREA

Permite añadir comentarios a las tareas por cualquier usuario involucrado.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id_comentario` | SERIAL | **PK** |
| `id_tarea` | INTEGER | FK → `tarea(id_tarea)`, NOT NULL |
| `id_autor` | UUID | FK → `perfiles(id)`, NOT NULL |
| `texto` | TEXT | NOT NULL |
| `fecha` | TIMESTAMPTZ | DEFAULT now() |

### 3.10. NOTIFICACIONES

Almacena las notificaciones enviadas a los usuarios del sistema.

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id_notificacion` | SERIAL | **PK** |
| `id_destino` | UUID | FK → `perfiles(id)`, NOT NULL |
| `titulo` | VARCHAR(200) | NOT NULL |
| `mensaje` | TEXT | — |
| `leido` | BOOLEAN | DEFAULT false |
| `tipo` | VARCHAR(50) | — |
| `referencia_id` | INTEGER | — |
| `fecha` | TIMESTAMPTZ | DEFAULT now() |

---

## 4. Relaciones principales

El modelo contiene **12 relaciones** (claves foráneas):

1. `perfiles.id_rol` → `rol.id_rol` — Cada perfil tiene un rol.
2. `terreno.id_gestor` → `perfiles.id` — Cada terreno pertenece a un gerente.
3. `tarea.id_terreno` → `terreno.id_terreno` — Cada tarea se ejecuta en un terreno.
4. `tarea.id_gerente` → `perfiles.id` — Cada tarea es creada por un gerente.
5. `tarea.id_capataz` → `perfiles.id` — Cada tarea puede ser asignada a un capataz.
6. `tarea.id_estado` → `estados_tarea.id_estado` — Cada tarea tiene un estado.
7. `gerente_capataz.id_gerente` → `perfiles.id` — Relación gerente-capataz.
8. `gerente_capataz.id_capataz` → `perfiles.id` — Relación gerente-capataz.
9. `capataz_trabajador.id_capataz` → `perfiles.id` — Relación capataz-trabajador.
10. `capataz_trabajador.id_trabajador` → `perfiles.id` — Relación capataz-trabajador.
11. `tarea_trabajador` → `tarea` y `perfiles` — Asignación de trabajadores a tareas.
12. `comentarios_tarea` / `notificaciones` → `tarea` y `perfiles` — Funcionalidades complementarias.

---

## 5. Políticas de seguridad (RLS)

Todas las tablas tienen habilitado **Row Level Security (RLS)** de Supabase:

- **ADMIN:** Acceso completo a todas las tablas.
- **GERENTE:** Solo ve/gestiona sus propios terrenos, tareas y capataces asignados.
- **CAPATAZ:** Solo ve las tareas que le han sido asignadas y sus trabajadores.
- **TRABAJADOR:** Solo ve sus propias asignaciones y notificaciones.

---

## 6. Patrón de eliminación lógica (Soft Delete)

Las tablas `perfiles`, `tarea` y `terreno` implementan un patrón de **soft delete** mediante el campo `fecha_baja`. Cuando se «elimina» un registro, se actualiza este campo con la fecha actual en lugar de eliminarlo físicamente, preservando la integridad referencial y el historial de datos.
