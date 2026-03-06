# 🌾 Agrogestión — Gestión agrícola web

Agrogestión es una aplicación web desarrollada como proyecto final del CFGS en Desarrollo de Aplicaciones Web (DAW). Permite gestionar usuarios, terrenos y tareas agrícolas utilizando una arquitectura moderna basada en **React 19**, **TypeScript**, **Vite 7**, **TailwindCSS 4** y **Supabase** como backend (auth + base de datos + API REST).

---

## 🌍 Descripción general
Agrogestión digitaliza la organización del trabajo en explotaciones agrícolas, permitiendo coordinar el trabajo entre distintos roles desde el navegador.

- **Gestión jerárquica de roles:** administrador, gerente, capataz y trabajador.
- **Control de terrenos** con alta, baja lógica y edición.
- **Creación y seguimiento de tareas agrícolas** con estados (pendiente, en progreso, completada).
- **Relaciones entre gerentes y capataces**, y asignación de trabajadores a tareas concretas.
- **Internacionalización (i18n):** soporte para español e inglés.
- **Recuperación de contraseña** mediante Supabase Auth.
- **Gráficos mensuales** para visualización de datos.
- **Tema claro/oscuro** con selector de tema.
- **Acceso desde cualquier dispositivo** con interfaz responsive y diseño limpio.

---

## 🗄️ Base de datos (Supabase)
La base de datos se implementa en Supabase (PostgreSQL gestionado) aprovechando:

- Tablas relacionales con claves foráneas.
- Autenticación integrada de usuarios (JWT).
- Políticas RLS (Row Level Security) para limitar el acceso a los datos según el rol.

**Tablas principales:**

| Tabla              | Descripción                                                         |
|--------------------|---------------------------------------------------------------------|
| rol                | Tipos de usuario: ADMIN, GERENTE, CAPATAZ, TRABAJADOR.              |
| usuario            | Perfil extendido del usuario (nombre, apellidos, rol, etc.).        |
| terreno            | Terrenos gestionados por los gerentes.                              |
| estados_tarea      | Estados posibles de una tarea (pendiente, en progreso, completada). |
| tarea              | Tareas agrícolas vinculadas a terrenos, gerentes y capataces.       |
| gerente_capataz    | Relación N:M entre gerentes y capataces.                            |
| tarea_trabajador   | Trabajadores que ayudan a un capataz en una tarea concreta.         |
| capataz_trabajador | Relación estable entre capataz y sus trabajadores habituales.       |

---

## 🧱 Estructura del proyecto

```
AGROGESTION/
├── public/                     # Recursos estáticos servidos por Vite
├── src/
│   ├── @types/                 # Declaraciones de tipos globales (i18next.d.ts)
│   ├── assets/                 # Recursos estáticos (imágenes, iconos, fuentes)
│   ├── components/             # Componentes reutilizables organizados por dominio
│   │   ├── admin/              # Panel de administración (AdminDashboard, UserTable)
│   │   ├── capataz/            # Panel del capataz (CapatazDashboard, TareaCapatazList)
│   │   ├── cards/              # Componentes de tarjetas (Card)
│   │   ├── charts/             # Gráficos y visualización de datos (MensualChart)
│   │   ├── common/             # Componentes comunes (Header, Footer, Layout, Sidebar, etc.)
│   │   ├── forms/              # Formularios (LoginForm, RegistroForm, ResetPasswordForm)
│   │   ├── gerente/            # Panel del gerente (GerenteDashboard, TerrenoList, TareaForm)
│   │   ├── home/               # Landing page
│   │   ├── profile/            # Perfil de usuario
│   │   ├── trabajador/         # Panel del trabajador (TrabajadorDashboard, MisTareasList)
│   │   └── ui/                 # Componentes UI genéricos (Table, Badge, Button, Select, SearchBar)
│   ├── context/                # Contextos React (AuthContext, ThemeContext)
│   ├── database/               # Capa de acceso a datos
│   │   ├── repositories/       # Interfaces de repositorios (patrón Repository)
│   │   └── supabase/           # Cliente Supabase + implementaciones de repositorios
│   │       └── RPCs/           # Funciones RPC de Supabase (isEmailTaken)
│   ├── hooks/                  # Custom hooks (useAuth, useTheme)
│   ├── interfaces/             # Tipos TypeScript para entidades del sistema
│   ├── lib/                    # Utilidades y configuración (constants, i18n)
│   ├── locales/                # Archivos de traducción (es.json, en.json)
│   ├── pages/                  # Vistas/páginas de la aplicación
│   ├── router/                 # Configuración de rutas (AppRouter, ProtectedRoute, PublicRoute)
│   ├── store/                  # Estado global (authStore con Zustand)
│   ├── styles/                 # Hojas de estilo (App.css, index.css)
│   ├── utils/                  # Funciones auxiliares (dates, regex, validators)
│   ├── App.tsx                 # Componente raíz
│   └── main.tsx                # Punto de entrada (React 19 + StrictMode)
├── .env                        # Variables de entorno (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── vite.config.ts              # Configuración de Vite (plugins: react-swc, tailwindcss)
├── tsconfig.json               # Configuración base de TypeScript
├── tsconfig.app.json           # Configuración TypeScript para la app
├── eslint.config.js            # Configuración de ESLint
├── package.json                # Dependencias y scripts
└── index.html                  # Punto de entrada HTML
```

---

## ⚙️ Instalación y ejecución local

### 1️⃣ Requisitos previos

| Software | Versión mínima               |
|----------|------------------------------|
| Node.js  | 18.x (recomendado 20.x LTS) |
| npm      | 9.x (incluido con Node.js)  |
| Git      | 2.x                         |

### 2️⃣ Clonar el repositorio
```bash
git clone https://github.com/Juanfrina/Agrogestion.Web.git
cd Agrogestion.Web/AGROGESTION
```

### 3️⃣ Instalar dependencias
```bash
npm install
```

### 4️⃣ Configurar Supabase
- Crear un proyecto en [Supabase](https://supabase.com/).
- Ejecutar los scripts SQL de creación de tablas y políticas RLS.
- Crear un archivo `.env` en la raíz de `AGROGESTION/`:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_publica
```

> ⚠️ El archivo `.env` contiene información sensible. No lo subas a repositorios públicos.

### 5️⃣ Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación se abrirá en: [http://localhost:5173](http://localhost:5173)

---

## 👤 Roles de usuario

| Rol        | Permisos principales                                                      |
|------------|---------------------------------------------------------------------------|
| ADMIN      | Gestiona usuarios, roles y configuración global.                          |
| GERENTE    | Gestiona terrenos, crea tareas y supervisa capataces.                     |
| CAPATAZ    | Toma tareas, actualiza estados y asigna trabajadores de apoyo.            |
| TRABAJADOR | Ve tareas en las que participa y consulta sus detalles.                   |

---

## 🧠 Tecnologías principales

| Tecnología               | Versión   | Uso                                              |
|--------------------------|-----------|--------------------------------------------------|
| React                    | 19.2.0    | Librería de interfaz de usuario (SPA)            |
| TypeScript               | 5.9.3     | Tipado estático sobre JavaScript                 |
| Vite                     | 7.2.4     | Build tool ultrarrápido con HMR                  |
| TailwindCSS              | 4.1.18    | Framework CSS de utilidades (responsive)          |
| Supabase                 | 2.93.3    | BaaS: PostgreSQL + Auth + API REST + RLS         |
| React Router             | 7.13.1    | Enrutamiento y navegación SPA                    |
| Zustand                  | 5.0.11    | Gestión de estado global ligera                  |
| i18next / react-i18next  | 25.8.14 / 16.5.4 | Internacionalización (español/inglés)    |
| @vitejs/plugin-react-swc | 4.2.2     | Compilación rápida con SWC                       |
| ESLint                   | 9.39.1    | Análisis estático de código                      |

---

## 💻 Comandos útiles

| Acción                      | Comando             |
|-----------------------------|---------------------|
| Instalar dependencias       | `npm install`       |
| Ejecutar en desarrollo      | `npm run dev`       |
| Construir para producción   | `npm run build`     |
| Previsualizar build         | `npm run preview`   |

---

## 🧩 Funcionalidades implementadas

- ✅ Registro e inicio de sesión con Supabase Auth.
- ✅ Recuperación de contraseña por email.
- ✅ Panel diferenciado según rol (admin, gerente, capataz, trabajador).
- ✅ Gestión de terrenos (alta, baja lógica, edición).
- ✅ Creación y asignación de tareas a terrenos y capataces.
- ✅ Cambio de estado de tareas (pendiente → en progreso → completada).
- ✅ Asignación de trabajadores a tareas concretas.
- ✅ Relaciones gerente-capataz y capataz-trabajador.
- ✅ Listados filtrados por terreno, estado y usuario.
- ✅ Internacionalización: español e inglés.
- ✅ Tema claro/oscuro.
- ✅ Gráficos mensuales de visualización de datos.
- ✅ Rutas protegidas por autenticación y rol.
- ✅ Políticas RLS en todas las tablas.

---

## 📚 Documentación

Los manuales completos del proyecto se encuentran en la carpeta `docs/`:

| Documento                  | Archivo                         |
|----------------------------|---------------------------------|
| Manual de Usuario          | `docs/A_Manual_de_Usuario.md`   |
| Manual Técnico             | `docs/B_Manual_Tecnico.md`      |
| Manual de Despliegue       | `docs/C_Manual_de_Despliegue.md`|
| Manual del Proyecto        | `docs/D_Manual_del_Proyecto.md` |

---

## 👨‍💻 Autoría

**Proyecto Agrogestión**
Alumno: Juan Francisco Hurtado Pérez
Ciclo: CFGS Desarrollo de Aplicaciones Web (DAW)
Centro: IES Albarregas – Mérida (España)
Curso: 2024/2025 – 2025/2026
Repositorio: https://github.com/Juanfrina/Agrogestion.Web
