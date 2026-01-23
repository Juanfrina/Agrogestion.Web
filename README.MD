# 🌾 Agrogestión — Gestión agrícola web

Agrogestión es una aplicación web desarrollada como proyecto final del ciclo de Desarrollo de Aplicaciones Web. Permite gestionar usuarios, terrenos y tareas agrícolas utilizando una arquitectura moderna basada en **React**, **Vite**, **TailwindCSS** y **Supabase** como backend (auth + base de datos + API).

---

## 🌍 Descripción general
Agrogestión digitaliza la organización del trabajo en explotaciones agrícolas, permitiendo coordinar el trabajo entre distintos roles desde el navegador.

- **Gestión jerárquica de roles:** administrador, gerente, capataz y trabajador.
- **Control de terrenos** y su estado.
- **Creación y seguimiento de tareas agrícolas** con estados (pendiente, en progreso, completada).
- **Relaciones entre gerentes y capataces**, y asignación de trabajadores a tareas concretas.
- **Acceso desde cualquier dispositivo** con interfaz responsive y diseño limpio.

---

## 🗄️ Base de datos (Supabase)
La base de datos se implementa en Supabase (PostgreSQL gestionado) aprovechando:

- Tablas relacionales con claves foráneas.
- Autenticación integrada de usuarios.
- Políticas RLS (Row Level Security) para limitar el acceso a los datos.

**Tablas principales (adaptadas desde el modelo Oracle/MySQL):**

| Tabla              | Descripción                                                        |
|--------------------|--------------------------------------------------------------------|
| rol                | Tipos de usuario: ADMIN, GERENTE, CAPATAZ, TRABAJADOR.             |
| usuario            | Perfil extendido del usuario (nombre, apellidos, rol, etc.).        |
| terreno            | Terrenos gestionados por los gerentes.                              |
| estados_tarea      | Estados posibles de una tarea (pendiente, en progreso, completada). |
| tarea              | Tareas agrícolas vinculadas a terrenos, gerentes y capataces.       |
| gerente_capataz    | Relación N:M entre gerentes y capataces.                            |
| tarea_trabajador   | Trabajadores que ayudan a un capataz en una tarea concreta.         |
| capataz_trabajador | Relación estable entre capataz y sus trabajadores habituales.        |

Supabase gestionará:
- **Auth:** registro e inicio de sesión.
- **RLS:** cada usuario sólo ve lo que le corresponde según su rol.

---

## 🧱 Estructura del proyecto

```
agrogestion/
│
├── docs/                   # Documentación (diagramas, memoria, etc.)
├── supabase/               # Migraciones SQL, políticas RLS, seeding
│
├── src/
│   ├── components/         # Componentes reutilizables (layout, tablas, formularios)
│   ├── pages/              # Vistas: Login, Terrenos, Tareas, Administración, etc.
│   ├── lib/                # Cliente Supabase, helpers de API
│   ├── context/            # Contexto de autenticación y rol de usuario
│   ├── App.jsx             # Rutas principales (React Router)
│   ├── main.jsx            # Punto de entrada con React + Vite
│   └── index.css           # Estilos globales (TailwindCSS)
│
├── public/                 # Recursos estáticos (logos, imágenes)
├── .env.local              # Variables de entorno (SUPABASE_URL, SUPABASE_ANON_KEY)
├── tailwind.config.cjs
├── postcss.config.cjs
├── vite.config.js
├── package.json
└── README.md
```

---

## ⚙️ Instalación y ejecución local

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/agrogestion.git
cd agrogestion
```

### 2️⃣ Configurar Supabase
- Crear un proyecto en [Supabase](https://supabase.com/).
- Configurar las tablas y relaciones usando los scripts SQL adaptados en `supabase/`.
- Activar RLS y definir políticas según los roles (admin, gerente, capataz, trabajador).
- En `.env.local`:

```bash
VITE_SUPABASE_URL=TU_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
```

### 3️⃣ Instalar dependencias
```bash
npm install
```

### 4️⃣ Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación se abrirá en:

[http://localhost:5173](http://localhost:5173)

---

## 👤 Roles de usuario

| Rol        | Permisos principales                                                      |
|------------|---------------------------------------------------------------------------|
| ADMIN      | Gestiona usuarios, roles y configuración global.                          |
| GERENTE    | Gestiona terrenos, crea tareas y supervisa capataces.                     |
| CAPATAZ    | Toma tareas, actualiza estados y asigna trabajadores de apoyo.            |
| TRABAJADOR | Ve tareas en las que participa y registra su progreso (si aplica).        |

---

## 🧠 Tecnologías principales

| Tecnología           | Uso                                         |
|----------------------|---------------------------------------------|
| React + Vite         | Interfaz rápida, SPA moderna                |
| TailwindCSS          | Estilos responsive, diseño consistente      |
| Supabase (PostgreSQL)| Base de datos, autenticación y API          |
| JavaScript (ESM)     | Lógica de frontend y llamadas a Supabase    |
| React Router         | Navegación entre vistas                     |

---

## 💻 Comandos útiles

| Acción                      | Comando             |
|-----------------------------|---------------------|
| Instalar dependencias       | npm install         |
| Ejecutar en desarrollo      | npm run dev         |
| Construir para producción   | npm run build       |
| Previsualizar build         | npm run preview     |

---

## 🧩 Funcionalidades previstas

- Registro e inicio de sesión con Supabase Auth.
- Panel según rol (admin, gerente, capataz, trabajador).
- Gestión de terrenos (alta, baja lógica, edición).
- Creación y asignación de tareas a terrenos.
- Tareas tomadas por capataces y cambio de estado.
- Asignación de trabajadores a tareas concretas.
- Listados filtrados por terreno, estado y usuario.

---

## 👨‍💻 Autoría

**Proyecto Agrogestión**  
Alumno: Juan Francisco Hurtado Pérez  
Ciclo: CFGS Desarrollo de Aplicaciones Web (DAW)  
Centro: IES Albarregas – Mérida (España)
