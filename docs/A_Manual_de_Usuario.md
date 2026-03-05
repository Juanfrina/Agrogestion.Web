# MANUAL DE USUARIO — AGROGESTIÓN

## Índice

1. Introducción
2. Requisitos para usar la aplicación
3. Acceso a la aplicación
4. Registro de nuevo usuario
5. Inicio de sesión (Login)
6. Panel del Administrador
7. Panel del Gerente
8. Panel del Capataz
9. Panel del Trabajador
10. Landing Page (Página de inicio)
11. Navegación general y zonas de la interfaz
12. Preguntas frecuentes

---

## 1. Introducción

Agrogestión es una aplicación web diseñada para digitalizar y facilitar la gestión del trabajo en explotaciones agrícolas. Permite coordinar las actividades diarias entre distintos roles: administradores, gerentes, capataces y trabajadores.

Este manual está dirigido a cualquier usuario que desee utilizar la aplicación, independientemente de sus conocimientos técnicos. Se describen paso a paso todas las pantallas, funciones y operaciones disponibles.

---

## 2. Requisitos para usar la aplicación

Para utilizar Agrogestión solo necesitas:

- Un dispositivo con acceso a Internet (ordenador, tablet o teléfono móvil).
- Un navegador web actualizado (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari).
- No es necesario instalar ningún programa adicional.

La aplicación es **responsive**, es decir, se adapta automáticamente al tamaño de la pantalla del dispositivo que estés utilizando.

---

## 3. Acceso a la aplicación

### 3.1. Página de inicio (Landing Page)

Al abrir la aplicación en tu navegador, llegarás a la **Landing Page** o página de inicio. Esta pantalla presenta:

- **Logotipo y nombre** de la aplicación: "Agrogestión".
- **Descripción breve** del propósito de la aplicación.
- **Botón "Iniciar sesión"**: Te llevará a la pantalla de login.
- **Botón "Registrarse"**: Te llevará al formulario de registro.

| Zona de la pantalla  | Descripción                                               |
|----------------------|-----------------------------------------------------------|
| Cabecera (Header)    | Logo, nombre de la app y enlaces de navegación.           |
| Cuerpo central       | Descripción de la aplicación y botones de acceso.         |
| Pie de página        | Información del autor, curso y centro educativo.          |

---

## 4. Registro de nuevo usuario

Si es la primera vez que accedes a Agrogestión, necesitarás crear una cuenta.

### Pasos para registrarse:

1. Desde la Landing Page, pulsa el botón **"Registrarse"**.
2. Se abrirá el formulario de registro con los siguientes campos:

| Campo               | Descripción                                                  |Obligatorio |
|---------------------|--------------------------------------------------------------|:----------:|
| Nombre              | Tu nombre real.                                              |Sí          |
| Apellidos           | Tus apellidos.                                               |Sí          |
| Correo electrónico  | Email válido que usarás para iniciar sesión.                 |Sí          |
| Contraseña          | Mínimo 6 caracteres. Se recomienda usar letras y números.    |Sí          |
| Confirmar contraseña| Repite la contraseña para evitar errores de escritura.       |Sí          |

3. Pulsa el botón **"Registrarse"**.
4. Si los datos son correctos, recibirás un mensaje de confirmación y podrás iniciar sesión.
5. Si hay algún error (correo ya registrado, contraseñas que no coinciden, etc.), se mostrará un mensaje en pantalla indicando el problema.

> **Nota:** El rol de usuario (gerente, capataz, trabajador) será asignado por el administrador del sistema una vez creada la cuenta. Por defecto, tras el registro el usuario no tendrá acceso a ningún panel hasta que se le asigne un rol.

---

## 5. Inicio de sesión (Login)

### Pasos para iniciar sesión:

1. Desde la Landing Page, pulsa el botón **"Iniciar sesión"**.
2. Introduce tus credenciales:

| Campo              | Descripción                              |
|--------------------|------------------------------------------|
| Correo electrónico | El email con el que te registraste.      |
| Contraseña         | La contraseña de tu cuenta.              |

3. Pulsa el botón **"Entrar"**.
4. Si las credenciales son correctas, serás redirigido automáticamente al panel correspondiente a tu rol:
   - **Administrador** → Panel de administración.
   - **Gerente** → Panel del gerente.
   - **Capataz** → Panel del capataz.
   - **Trabajador** → Panel del trabajador.
5. Si las credenciales son incorrectas, verás un mensaje de error. Comprueba tu email y contraseña e inténtalo de nuevo.

### Recuperar contraseña

Si has olvidado tu contraseña:

1. En la pantalla de login, pulsa el enlace **"¿Olvidaste tu contraseña?"**.
2. Introduce tu correo electrónico en el formulario que aparece.
3. Pulsa **"Enviar enlace de recuperación"**.
4. Recibirás un email con un enlace para restablecer tu contraseña.
5. Sigue las instrucciones del email para crear una nueva contraseña.

> **Nota:** Si no recibes el email, revisa la carpeta de spam o correo no deseado.

### Cerrar sesión

En cualquier panel, encontrarás un botón o enlace de **"Cerrar sesión"** en la zona de cabecera (header). Al pulsarlo:
- Se cierra tu sesión de forma segura.
- Serás redirigido a la Landing Page.

---

## 6. Panel del Administrador

El administrador tiene el nivel de permisos más alto. Desde su panel puede gestionar todos los usuarios del sistema.

### 6.1. Pantalla principal del Administrador

| Zona                   | Descripción                                                          |
|------------------------|----------------------------------------------------------------------|
| Cabecera               | Logo, nombre del usuario logueado, botón de cerrar sesión.           |
| Menú lateral/superior  | Accesos directos a: Usuarios, Roles, Configuración.                  |
| Área de contenido      | Tablas y formularios para gestionar los datos.                       |

### 6.2. Gestión de usuarios

El administrador puede:

- **Ver la lista completa de usuarios** registrados en el sistema, con nombre, apellidos, email y rol asignado.
- **Asignar o cambiar el rol** de un usuario (GERENTE, CAPATAZ, TRABAJADOR).
- **Dar de baja** un usuario (desactivar su cuenta sin eliminarla de la base de datos).
- **Buscar usuarios** por nombre o email mediante un campo de búsqueda.

### 6.3. Gestión de roles

El administrador puede consultar los roles disponibles en el sistema:

| Rol         | Descripción                                                   |
|-------------|---------------------------------------------------------------|
| ADMIN       | Gestión global del sistema.                                   |
| GERENTE     | Gestión de terrenos y creación de tareas.                     |
| CAPATAZ     | Ejecución de tareas y gestión de trabajadores.                |
| TRABAJADOR  | Participación en tareas asignadas.                            |

---

## 7. Panel del Gerente

El gerente es el responsable de la gestión de terrenos y de la creación y supervisión de tareas agrícolas.

### 7.1. Pantalla principal del Gerente

| Zona                   | Descripción                                                          |
|------------------------|----------------------------------------------------------------------|
| Cabecera               | Logo, nombre del gerente, botón de cerrar sesión.                    |
| Menú lateral/superior  | Accesos a: Terrenos, Tareas, Capataces.                              |
| Área de contenido      | Tablas con terrenos, tareas y relaciones con capataces.              |

### 7.2. Gestión de terrenos

El gerente puede:

- **Ver la lista de terrenos** que gestiona, con información como nombre, ubicación, superficie y estado.
- **Dar de alta un nuevo terreno** rellenando un formulario con los datos del terreno.
- **Editar un terreno existente** para modificar sus datos.
- **Dar de baja (baja lógica)** un terreno que ya no se utilice, sin eliminarlo permanentemente.

| Campo del terreno | Descripción                            |
|-------------------|----------------------------------------|
| Nombre            | Nombre identificativo del terreno.     |
| Ubicación         | Dirección o referencia geográfica.     |
| Superficie        | Extensión del terreno (en hectáreas).  |
| Estado            | Activo / Inactivo.                     |

### 7.3. Gestión de tareas

El gerente puede:

- **Crear tareas agrícolas** asociadas a un terreno concreto.
- **Asignar una tarea** a un capataz para que la ejecute.
- **Ver el estado** de cada tarea (pendiente, en progreso, completada).
- **Filtrar tareas** por terreno, estado o capataz asignado.

| Campo de la tarea   | Descripción                                          |
|---------------------|------------------------------------------------------|
| Nombre / Descripción| Qué se debe hacer.                                   |
| Terreno             | Terreno donde se realiza la tarea.                   |
| Capataz asignado    | Capataz responsable de ejecutar la tarea.            |
| Estado              | Pendiente / En progreso / Completada.                |
| Fecha de creación   | Fecha en que se creó la tarea.                       |

### 7.4. Gestión de capataces

El gerente puede:

- **Ver la lista de capataces** asociados a él.
- **Asociar o desasociar capataces** de su equipo.

---

## 8. Panel del Capataz

El capataz se encarga de ejecutar las tareas que le asignan los gerentes y de coordinar a los trabajadores.

### 8.1. Pantalla principal del Capataz

| Zona                   | Descripción                                                          |
|------------------------|----------------------------------------------------------------------|
| Cabecera               | Logo, nombre del capataz, botón de cerrar sesión.                    |
| Menú lateral/superior  | Accesos a: Mis Tareas, Trabajadores.                                 |
| Área de contenido      | Lista de tareas asignadas y opciones de gestión.                     |

### 8.2. Mis Tareas

El capataz puede:

- **Ver las tareas asignadas** por los gerentes.
- **Tomar una tarea** pendiente (cambiar su estado a "En progreso").
- **Marcar una tarea como completada** cuando se haya terminado.
- **Asignar trabajadores de apoyo** a una tarea concreta.

### Flujo del estado de una tarea:

```
PENDIENTE  →  EN PROGRESO  →  COMPLETADA
```

- **Pendiente:** La tarea ha sido creada por el gerente pero aún no se ha comenzado.
- **En progreso:** El capataz ha tomado la tarea y está trabajando en ella.
- **Completada:** La tarea se ha finalizado correctamente.

### 8.3. Gestión de trabajadores

El capataz puede:

- **Ver la lista de sus trabajadores habituales** (relación estable capataz-trabajador).
- **Asignar trabajadores** a tareas concretas como apoyo.
- **Desasignar trabajadores** de una tarea.

---

## 9. Panel del Trabajador

El trabajador es el rol con menos permisos. Su función principal es consultar las tareas en las que participa.

### 9.1. Pantalla principal del Trabajador

| Zona                   | Descripción                                                          |
|------------------------|----------------------------------------------------------------------|
| Cabecera               | Logo, nombre del trabajador, botón de cerrar sesión.                 |
| Área de contenido      | Lista de tareas en las que participa el trabajador.                  |

### 9.2. Mis Tareas

El trabajador puede:

- **Ver las tareas** en las que ha sido asignado como apoyo.
- **Consultar los detalles** de cada tarea: descripción, terreno, capataz responsable y estado actual.
- **Registrar su progreso** si la funcionalidad está habilitada.

---

## 10. Landing Page (Página de inicio)

La Landing Page es la primera pantalla visible al acceder a la URL de la aplicación. Está diseñada para presentar Agrogestión a usuarios nuevos y proporcionar acceso rápido a las funciones de login y registro.

### Elementos de la Landing Page:

| Elemento              | Descripción                                                |
|-----------------------|------------------------------------------------------------|
| Logo "Agrogestión"    | Identidad visual de la aplicación.                         |
| Título y subtítulo    | "Gestión agrícola web" y descripción del propósito.        |
| Botón "Iniciar sesión"| Lleva al formulario de login.                              |
| Botón "Registrarse"   | Lleva al formulario de registro.                           |
| Pie de página         | Créditos del autor y centro educativo.                     |

---

## 11. Navegación general y zonas de la interfaz

### 11.1. Estructura común de todas las pantallas

Todas las pantallas de la aplicación comparten una estructura visual coherente:

```
┌──────────────────────────────────────────────────┐
│                   CABECERA                       │
│ [Logo]  Agrogestión    [Usuario]  [Cerrar sesión]│
├──────────────┬───────────────────────────────────┤
│              │                                   │
│   MENÚ       │        ÁREA DE CONTENIDO          │
│  LATERAL     │                                   │
│              │   (Tablas, formularios, listas)   │
│              │                                   │
├──────────────┴───────────────────────────────────┤
│                 PIE DE PÁGINA                    │
└──────────────────────────────────────────────────┘
```

### 11.2. Cabecera (Header)

- Logo y nombre de la aplicación (siempre visible).
- Nombre del usuario logueado y su rol.
- Selector de idioma (español / inglés).
- Botón de cerrar sesión.

### 11.3. Cambio de idioma

La aplicación soporta dos idiomas: **español** e **inglés**. Puedes cambiar el idioma en cualquier momento pulsando el selector de idioma en la cabecera. La interfaz se traducirá automáticamente sin necesidad de recargar la página.

### 11.4. Menú de navegación

- Cambia según el rol del usuario.
- Permite acceder a las diferentes secciones del panel.

### 11.4. Área de contenido

- Es la zona central donde se muestran los datos.
- Contiene tablas, formularios, botones de acción y mensajes informativos.

### 11.5. Pie de página (Footer)

- Información del autor y del proyecto.

### 11.6. Diseño responsive

La interfaz se adapta automáticamente a distintos tamaños de pantalla:

| Dispositivo  | Comportamiento                                         |
|--------------|--------------------------------------------------------|
| Escritorio   | Menú lateral visible, tablas con columnas completas.   |
| Tablet       | Menú colapsable, tablas adaptadas.                     |
| Móvil        | Menú tipo hamburguesa, contenido en una sola columna.  |

---

## 12. Preguntas frecuentes

### ¿Qué hago si olvido mi contraseña?
Desde la pantalla de login, pulsa **"¿Olvidaste tu contraseña?"** e introduce tu correo electrónico. Recibirás un email con un enlace para restablecer tu contraseña.

### ¿Puedo tener más de un rol?
No. Cada usuario tiene un único rol asignado en el sistema.

### ¿Puedo usar la aplicación desde el móvil?
Sí. La aplicación es responsive y funciona correctamente en cualquier dispositivo con navegador web.

### ¿En qué idiomas está disponible?
La aplicación está disponible en español e inglés. Puedes cambiar el idioma desde el selector en la cabecera.

### ¿Quién me asigna el rol después de registrarme?
El administrador del sistema revisa los nuevos registros y asigna el rol correspondiente.

### ¿Mis datos están seguros?
Sí. La aplicación utiliza Supabase como backend, que implementa autenticación segura y políticas de seguridad a nivel de fila (RLS) para que cada usuario solo pueda acceder a los datos que le corresponden según su rol.

---

**Agrogestión — Manual de Usuario**
Autor: Juan Francisco Hurtado Pérez
Ciclo: CFGS Desarrollo de Aplicaciones Web (DAW)
Centro: IES Albarregas – Mérida (España)
