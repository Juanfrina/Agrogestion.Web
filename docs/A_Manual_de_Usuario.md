# MANUAL DE USUARIO — AGROGESTIÓN

## Índice

1. [Introducción](#1-introducción)
2. [Requisitos para usar la aplicación](#2-requisitos-para-usar-la-aplicación)
3. [Acceso a la aplicación](#3-acceso-a-la-aplicación)
4. [Registro de nuevo usuario](#4-registro-de-nuevo-usuario)
5. [Inicio de sesión (Login)](#5-inicio-de-sesión-login)
6. [Perfil de usuario](#6-perfil-de-usuario)
7. [Panel del Administrador](#7-panel-del-administrador)
8. [Panel del Gerente](#8-panel-del-gerente)
9. [Panel del Capataz](#9-panel-del-capataz)
10. [Panel del Trabajador](#10-panel-del-trabajador)
11. [Landing Page (Página de inicio)](#11-landing-page-página-de-inicio)
12. [Navegación general y zonas de la interfaz](#12-navegación-general-y-zonas-de-la-interfaz)
13. [Preguntas frecuentes](#13-preguntas-frecuentes)

---

## 1. Introducción

Agrogestión es una aplicación web diseñada para digitalizar y facilitar la gestión del trabajo en explotaciones agrícolas. Permite coordinar las actividades diarias entre distintos roles: administradores, gerentes, capataces y trabajadores.

Este manual está dirigido a cualquier usuario que desee utilizar la aplicación, independientemente de sus conocimientos técnicos. Se describen paso a paso todas las pantallas, funciones y operaciones disponibles.

La aplicación está disponible en tres idiomas: **español**, **inglés** y **rumano**.

---

## 2. Requisitos para usar la aplicación

Para utilizar Agrogestión solo necesitas:

- Un dispositivo con acceso a Internet (ordenador, tablet o teléfono móvil).
- Un navegador web actualizado (Google Chrome, Mozilla Firefox, Microsoft Edge o Safari).
- No es necesario instalar ningún programa adicional.

La aplicación es **responsive**, es decir, se adapta automáticamente al tamaño de la pantalla del dispositivo que estés utilizando. En dispositivos móviles, el menú lateral se convierte en un menú tipo hamburguesa (☰) y las tablas permiten desplazamiento horizontal.

---

## 3. Acceso a la aplicación

### 3.1. Página de inicio (Landing Page)

Al abrir la aplicación en tu navegador, llegarás a la **Landing Page** o página de inicio. Esta pantalla presenta:

- **Logotipo y nombre** de la aplicación: "Agrogestión".
- **Eslogan** y descripción del propósito de la aplicación.
- **Sección Hero** con imagen de paisaje agrícola de fondo y botones de acceso superpuestos.
- **Sección de características** destacadas de la aplicación.
- **Botón "Iniciar sesión"**: Te llevará a la pantalla de login.
- **Botón "Registrarse"**: Te llevará al formulario de registro.
- **Selector de idioma**: Permite cambiar entre español, inglés y rumano.

*(Captura: Landing Page completa — vista escritorio)*

| Zona de la pantalla  | Descripción                                                       |
|----------------------|-------------------------------------------------------------------|
| Cabecera (Header)    | Logo, nombre de la app, botones de login/registro, selector de idioma. |
| Sección Hero         | Logo grande, eslogan y botones de acceso.                         |
| Características      | Resumen visual de las funcionalidades principales.                |
| Pie de página        | Información del autor, curso, centro educativo y enlaces legales. |

---

## 4. Registro de nuevo usuario

Si es la primera vez que accedes a Agrogestión, necesitarás crear una cuenta.

*(Captura: Formulario de registro)*

### Pasos para registrarse:

1. Desde la Landing Page, pulsa el botón **"Registrarse"**.
2. Se abrirá el formulario de registro con los siguientes campos:

| Campo               | Descripción                                                  | Obligatorio |
|---------------------|--------------------------------------------------------------|:-----------:|
| Nombre              | Tu nombre real.                                              | Sí          |
| Apellidos           | Tus apellidos.                                               | Sí          |
| Correo electrónico  | Email válido que usarás para iniciar sesión.                 | Sí          |
| Teléfono            | Tu número de teléfono de contacto.                           | No          |
| Dirección           | Tu dirección postal.                                         | No          |
| DNI                 | Tu documento nacional de identidad.                          | No          |
| Rol                 | Selecciona tu rol: Gerente, Capataz o Trabajador.           | Sí          |
| Contraseña          | Mínimo 6 caracteres. Se recomienda usar letras y números.   | Sí          |
| Confirmar contraseña| Repite la contraseña para evitar errores de escritura.       | Sí          |

3. Pulsa el botón **"Registrarse"**.
4. Si los datos son correctos, recibirás un mensaje de confirmación y podrás iniciar sesión.
5. Si hay algún error (correo ya registrado, contraseñas que no coinciden, etc.), se mostrará un **mensaje de alerta** en pantalla indicando el problema.

> **Nota:** Durante el registro puedes seleccionar el rol que desees (Gerente, Capataz o Trabajador). El administrador puede modificar tu rol posteriormente si es necesario.

---

## 5. Inicio de sesión (Login)

*(Captura: Pantalla de login)*

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

En cualquier panel, encontrarás un botón de **"Cerrar sesión"** en la barra lateral (sidebar). Al pulsarlo:
- Se cierra tu sesión de forma segura.
- Serás redirigido a la Landing Page.

---

## 6. Perfil de usuario

Todos los usuarios, independientemente de su rol, pueden acceder a su perfil personal desde el menú lateral.

*(Captura: Pantalla de perfil de usuario)*

### Datos del perfil

Desde la sección **"Mi Perfil"** puedes consultar y editar tus datos personales:

| Campo              | Descripción                              | Editable |
|--------------------|------------------------------------------|:--------:|
| Nombre             | Tu nombre real.                          | Sí       |
| Apellidos          | Tus apellidos.                           | Sí       |
| Correo electrónico | El email con el que te registraste.      | Sí       |
| Teléfono           | Tu número de contacto.                   | Sí       |
| Dirección          | Tu dirección postal.                     | Sí       |
| DNI                | Tu documento de identidad.               | No       |
| Rol                | Tu rol en el sistema.                    | No       |

Para guardar los cambios, pulsa el botón **"Guardar"**. Se mostrará un mensaje de confirmación si la actualización fue exitosa.

> **Nota:** El rol solo puede ser modificado por el administrador del sistema.

---

## 7. Panel del Administrador

El administrador tiene el nivel de permisos más alto. Desde su panel puede gestionar todos los usuarios del sistema y visualizar estadísticas globales.

*(Captura: Dashboard del administrador — vista completa)*

### 7.1. Dashboard del Administrador

La pantalla principal del administrador muestra:

| Zona                        | Descripción                                                          |
|-----------------------------|----------------------------------------------------------------------|
| Cabecera                    | Nombre del usuario, rol, selector de idioma y botón de cerrar sesión.|
| Menú lateral (Sidebar)      | Accesos a: Dashboard, Usuarios, Mi Perfil, Cerrar sesión.           |
| Tarjetas de estadísticas    | Resumen visual de usuarios totales y desglose por rol.               |
| Gráficos                    | Registros mensuales y distribución de roles.                         |

#### Tarjetas de estadísticas

En la parte superior del dashboard se muestran **tarjetas con colores diferenciados** que resumen:

| Tarjeta         | Color de fondo | Información                    |
|-----------------|----------------|--------------------------------|
| Total usuarios  | Verde claro    | Número total de usuarios activos. |
| Administradores | Azul claro     | Cantidad de administradores.   |
| Gerentes        | Verde lima     | Cantidad de gerentes.          |
| Capataces       | Amarillo claro | Cantidad de capataces.         |
| Trabajadores    | Marrón claro   | Cantidad de trabajadores.      |

*(Captura: Tarjetas de estadísticas del admin)*

#### Gráficos

Debajo de las tarjetas se muestran dos gráficos:

- **Registros mensuales:** Gráfico de barras que muestra cuántos usuarios se han registrado cada mes.
- **Distribución de roles:** Gráfico que visualiza la proporción de usuarios por rol.

*(Captura: Gráficos del dashboard del admin)*

### 7.2. Gestión de usuarios

*(Captura: Tabla de usuarios del admin)*

El administrador puede acceder a la tabla completa de usuarios desde el menú lateral. Las funciones disponibles son:

- **Ver la lista completa de usuarios** registrados en el sistema, con nombre, apellidos, email, teléfono, rol y estado (activo/inactivo).
- **Buscar usuarios** por nombre o email mediante la barra de búsqueda en tiempo real.
- **Editar los datos de un usuario** pulsando el botón **"Editar"** (color acento dorado). Se abrirá un modal con los campos editables:

| Campo    | Descripción                              |
|----------|------------------------------------------|
| Nombre   | Nombre del usuario.                      |
| Apellidos| Apellidos del usuario.                   |
| Email    | Correo electrónico.                      |
| Teléfono | Número de teléfono.                      |
| Dirección| Dirección postal.                        |
| DNI      | Documento de identidad.                  |

*(Captura: Modal de edición de usuario)*

- **Cambiar el rol** de un usuario pulsando **"Cambiar Rol"**. Se abrirá un modal donde seleccionar el nuevo rol (Admin, Gerente, Capataz, Trabajador).
- **Desactivar un usuario** pulsando **"Desactivar"**, lo que realiza una baja lógica sin eliminar sus datos.
- **Reactivar un usuario** previamente desactivado pulsando **"Reactivar"**.

### 7.3. Roles del sistema

| Rol         | Descripción                                                   |
|-------------|---------------------------------------------------------------|
| ADMIN       | Gestión global del sistema y usuarios.                        |
| GERENTE     | Gestión de terrenos, tareas y equipo de capataces.            |
| CAPATAZ     | Ejecución de tareas y gestión de trabajadores.                |
| TRABAJADOR  | Participación en tareas asignadas.                            |

---

## 8. Panel del Gerente

El gerente es el responsable de la gestión de terrenos y de la creación y supervisión de tareas agrícolas.

*(Captura: Dashboard del gerente)*

### 8.1. Dashboard del Gerente

La pantalla principal del gerente muestra un resumen con:

| Zona                        | Descripción                                                          |
|-----------------------------|----------------------------------------------------------------------|
| Cabecera                    | Nombre del usuario, rol, selector de idioma.                         |
| Menú lateral (Sidebar)      | Accesos a: Dashboard, Terrenos, Tareas, Mi Equipo, Mi Perfil, Cerrar sesión. |
| Tarjetas de estadísticas    | Resumen de terrenos activos, tareas pendientes, en progreso y completadas. |
| Gráfico                     | Evolución mensual de tareas.                                         |

### 8.2. Gestión de terrenos

*(Captura: Lista de terrenos del gerente)*

El gerente puede:

- **Ver la lista de terrenos** que gestiona, con información como nombre, descripción y estado.
- **Dar de alta un nuevo terreno** pulsando **"Nuevo Terreno"** y rellenando el formulario.
- **Editar un terreno existente** para modificar sus datos.
- **Dar de baja (baja lógica)** un terreno que ya no se utilice pulsando **"Eliminar"**, sin eliminarlo permanentemente.

*(Captura: Formulario de nuevo terreno)*

| Campo del terreno | Descripción                            | Obligatorio |
|-------------------|----------------------------------------|:-----------:|
| Nombre            | Nombre identificativo del terreno.     | Sí          |
| Ubicación         | Dirección o referencia geográfica.      | Sí          |
| Tipo de cultivo   | Tipo de cultivo (olivo, viña, cereal…).| Sí          |

### 8.3. Gestión de tareas

*(Captura: Lista de tareas del gerente)*

El gerente puede:

- **Crear tareas agrícolas** asociadas a un terreno concreto pulsando **"Nueva Tarea"**.
- **Asignar una tarea** a un capataz de su equipo para que la ejecute.
- **Ver el estado** de cada tarea (pendiente, en progreso, completada) mediante **badges** de colores.
- **Ver el indicador 💬** con el número de comentarios en cada tarea.
- **Ver y escribir comentarios** en las tareas pulsando el botón **“Comentarios”**, para comunicarse con capataces y trabajadores.
- **Filtrar tareas** por terreno, estado o capataz asignado.
- **Eliminar tareas** que ya no sean necesarias.

*(Captura: Formulario de nueva tarea)*

| Campo de la tarea   | Descripción                                          | Obligatorio |
|---------------------|------------------------------------------------------|:-----------:|
| Nombre              | Título descriptivo de la tarea.                      | Sí          |
| Descripción         | Qué se debe hacer en detalle.                        | No          |
| Terreno             | Terreno donde se realiza la tarea (selector).        | Sí          |
| Capataz asignado    | Capataz responsable de ejecutar la tarea (selector). | Sí          |
| Fecha inicio        | Fecha prevista de inicio.                            | Sí          |
| Fecha fin           | Fecha prevista de finalización.                      | Sí          |

### 8.4. Gestión de equipo (Mi Equipo)

*(Captura: Mi Equipo del gerente)*

El gerente puede:

- **Ver la lista de capataces** asociados a su equipo.
- **Asociar nuevos capataces** a su equipo.
- **Desasociar capataces** que ya no trabajan con él.

---

## 9. Panel del Capataz

El capataz se encarga de ejecutar las tareas que le asignan los gerentes y de coordinar a los trabajadores.

*(Captura: Dashboard del capataz)*

### 9.1. Dashboard del Capataz

La pantalla principal del capataz muestra:

| Zona                        | Descripción                                                          |
|-----------------------------|----------------------------------------------------------------------|
| Cabecera                    | Nombre del usuario, rol, 🔔 campanita de notificaciones, selector de idioma. |
| Menú lateral (Sidebar)      | Accesos a: Dashboard, Mis Tareas, Mi Equipo, Mi Perfil, Cerrar sesión. |
| Tarjetas de estadísticas    | Resumen de tareas pendientes, en progreso y completadas.             |
| Gráfico                     | Evolución mensual de tareas.                                         |

### 9.2. Campanita de notificaciones 🔔

En la cabecera, al lado del nombre del usuario, aparece un **icono de campana** con un **contador rojo** que indica el número de notificaciones no leídas. Al pulsar la campanita se abre un modal con el historial de notificaciones.

- Las **notificaciones no leídas** se destacan con fondo y un punto de color.
- Al **hacer clic en una notificación** se marca como leída.
- El botón **“Marcar todas como leídas”** resetea el contador a cero.
- Las notificaciones se actualizan automáticamente cada 30 segundos.

### 9.3. Mis Tareas

*(Captura: Lista de tareas del capataz)*

El capataz puede:

- **Ver las tareas asignadas** por los gerentes.
- **Ver el indicador 💬** con el número de comentarios en cada tarea.
- **Tomar una tarea** pendiente (cambiar su estado a “En progreso”).
- **Marcar una tarea como completada** cuando se haya terminado.
- **Escribir y leer comentarios** en cada tarea pulsando el botón “Comentarios”.
- **Asignar trabajadores de apoyo** a una tarea concreta pulsando el botón de asignación.

### Flujo del estado de una tarea:

```
PENDIENTE → ASIGNADA → ACEPTADA → EN PROGRESO → COMPLETADA
                         ↓
                     RECHAZADA
```

| Estado        | Significado                                                    | Color del badge |
|---------------|----------------------------------------------------------------|-----------------|
| Pendiente     | La tarea ha sido creada pero aún no se ha asignado.            | Amarillo        |
| Asignada      | La tarea ha sido asignada a un capataz.                        | Naranja         |
| Aceptada      | El capataz ha aceptado la tarea.                               | Azul claro      |
| Rechazada     | El capataz ha rechazado la tarea.                              | Rojo            |
| En progreso   | El capataz está trabajando activamente en la tarea.            | Azul            |
| Completada    | La tarea se ha finalizado correctamente.                       | Verde           |

### 9.4. Gestión de equipo (Mi Equipo)

*(Captura: Mi Equipo del capataz)*

El capataz puede:

- **Ver la lista de sus trabajadores habituales** (relación estable capataz-trabajador).
- **Asociar nuevos trabajadores** a su equipo.
- **Desasociar trabajadores** de su equipo.
- **Asignar trabajadores** a tareas concretas como apoyo desde la lista de tareas.

---

## 10. Panel del Trabajador

El trabajador es el rol con menos permisos. Su función principal es consultar las tareas en las que participa.

*(Captura: Dashboard del trabajador)*

### 10.1. Dashboard del Trabajador

| Zona                        | Descripción                                                          |
|-----------------------------|----------------------------------------------------------------------|
| Cabecera                    | Nombre del usuario, rol, 🔔 campanita de notificaciones, selector de idioma. |
| Menú lateral (Sidebar)      | Accesos a: Dashboard, Mis Tareas, Mi Perfil, Cerrar sesión.         |
| Tarjetas de estadísticas    | Resumen de tareas en las que participa.                              |

### 10.2. Campanita de notificaciones 🔔

Igual que en el panel del capataz, el trabajador dispone de una **campanita de notificaciones** en la cabecera con contador de no leídas. Al pulsarla se abre un modal donde puede ver todas sus notificaciones, marcarlas como leídas individualmente o todas a la vez.

### 10.3. Mis Tareas

*(Captura: Lista de tareas del trabajador)*

El trabajador puede:

- **Ver las tareas** en las que ha sido asignado como apoyo.
- **Ver el indicador 💬** con el número de comentarios en cada tarea.
- **Aceptar o rechazar** una tarea que le han asignado (el estado pasa a ACEPTADA o RECHAZADA).
- **Consultar los detalles** de cada tarea: nombre, descripción, terreno, capataz responsable, fechas y estado actual.
- **Añadir y leer comentarios** en las tareas pulsando el botón "Comentarios".

> **Nota:** El trabajador no puede modificar el estado general de las tareas, solo aceptar/rechazar su asignación y añadir comentarios.

---

## 11. Landing Page (Página de inicio)

La Landing Page es la primera pantalla visible al acceder a la URL de la aplicación. Está diseñada para presentar Agrogestión a usuarios nuevos y proporcionar acceso rápido a las funciones de login y registro.

*(Captura: Landing Page completa)*

### Elementos de la Landing Page:

| Elemento                  | Descripción                                                        |
|---------------------------|--------------------------------------------------------------------|
| Cabecera                  | Logo, nombre de la app, botones de login/registro, selector de idioma. |
| Sección Hero              | Imagen de paisaje agrícola de fondo a ancho completo con el título, eslogan, descripción y botones de acceso superpuestos. |
| Sección de características| Tarjetas con las funcionalidades principales de la aplicación.     |
| Pie de página             | Créditos del autor, centro educativo y enlaces legales.            |

---

## 12. Navegación general y zonas de la interfaz

### 12.1. Estructura común de todas las pantallas

Todas las pantallas de la aplicación (excepto la Landing Page y las de autenticación) comparten una estructura visual coherente:

```
┌──────────────────────────────────────────────────┐
│                   CABECERA                       │
│ [☰]  Agrogestión    [Usuario]  [Idioma]          │
├──────────────┬───────────────────────────────────┤
│              │                                   │
│   MENÚ       │        ÁREA DE CONTENIDO          │
│  LATERAL     │                                   │
│  (Sidebar)   │   (Tablas, formularios, listas,   │
│              │    tarjetas, gráficos)             │
│              │                                   │
├──────────────┴───────────────────────────────────┤
│                 PIE DE PÁGINA                    │
└──────────────────────────────────────────────────┘
```

*(Captura: Estructura general de la interfaz — escritorio)*

### 12.2. Cabecera (Header)

La cabecera se muestra en la parte superior de todas las pantallas y contiene:

- **Botón hamburguesa (☰):** Solo visible en móviles. Abre/cierra el menú lateral.
- **Logo y nombre** de la aplicación (siempre visible).
- **Campanita de notificaciones 🔔:** Solo visible para capataces y trabajadores. Muestra un contador rojo con las notificaciones no leídas. Al pulsarla se abre un modal con el historial.
- **Nombre y apellidos** del usuario logueado (oculto en móviles para ahorrar espacio).
- **Selector de idioma:** Permite cambiar entre español, inglés y rumano.

### 12.3. Menú lateral (Sidebar)

- Se muestra de forma permanente en pantallas de escritorio (≥768px).
- En dispositivos móviles, se oculta y se abre pulsando el botón hamburguesa (☰).
- Al navegar a otra sección en móvil, el menú se cierra automáticamente.
- Un **overlay oscuro** cubre el fondo cuando el menú está abierto en móvil.

El contenido del menú lateral cambia según el rol del usuario:

| Rol         | Secciones en el menú                                         |
|-------------|--------------------------------------------------------------|
| ADMIN       | Dashboard, Usuarios, Mi Perfil, Cerrar sesión.               |
| GERENTE     | Dashboard, Terrenos, Tareas, Mi Equipo, Mi Perfil, Cerrar sesión. |
| CAPATAZ     | Dashboard, Mis Tareas, Mi Equipo, Mi Perfil, Cerrar sesión.  |
| TRABAJADOR  | Dashboard, Mis Tareas, Mi Perfil, Cerrar sesión.             |

### 12.4. Cambio de idioma

La aplicación soporta tres idiomas: **español**, **inglés** y **rumano**. Puedes cambiar el idioma en cualquier momento pulsando el selector de idioma en la cabecera. La interfaz se traducirá automáticamente sin necesidad de recargar la página.

### 12.5. Área de contenido

- Es la zona central donde se muestran los datos.
- Contiene tarjetas de estadísticas, tablas, formularios, gráficos, botones de acción y mensajes informativos.
- Las tablas tienen desplazamiento horizontal en dispositivos móviles para mostrar todas las columnas.
- Los formularios se abren en **ventanas modales** (pop-ups) que se superponen al contenido, con desplazamiento vertical si el contenido es largo.

### 12.6. Pie de página (Footer)

- Información del autor, centro educativo y proyecto.
- Texto en blanco sobre fondo verde oscuro.

### 12.7. Componentes comunes de la interfaz

| Componente     | Descripción                                                          |
|----------------|----------------------------------------------------------------------|
| Tarjetas (Card)| Contenedores con borde y fondo que agrupan información.              |
| Tabla (Table)  | Muestra datos en filas y columnas con scroll horizontal en móvil.    |
| Badge          | Etiqueta de color que indica un estado (pendiente, en progreso, etc.).|
| Botón primario | Color verde — acciones principales (crear, guardar).                 |
| Botón secundario| Color tierra — acciones secundarias (cancelar, volver).             |
| Botón acento   | Color dorado — acciones especiales (editar).                         |
| Botón peligro  | Color rojo — acciones destructivas (eliminar, desactivar).           |
| Modal          | Ventana emergente para formularios y confirmaciones.                 |
| Alerta         | Mensajes de éxito, error o información que aparecen temporalmente.   |
| Barra de búsqueda| Campo de texto para filtrar listas y tablas en tiempo real.        |
| Spinner        | Indicador de carga mientras se obtienen datos del servidor.          |

### 12.8. Diseño responsive

La interfaz se adapta automáticamente a distintos tamaños de pantalla:

| Dispositivo  | Comportamiento                                                     |
|--------------|--------------------------------------------------------------------|
| Escritorio   | Menú lateral visible permanentemente, tablas completas, padding amplio. |
| Tablet       | Menú lateral oculto (hamburguesa), tablas con scroll, padding medio.|
| Móvil        | Menú hamburguesa, títulos y botones apilados, tablas con scroll horizontal, padding reducido. |

*(Captura: Comparativa escritorio vs. móvil de una misma pantalla)*

---

## 13. Preguntas frecuentes

### ¿Qué hago si olvido mi contraseña?
Desde la pantalla de login, pulsa **"¿Olvidaste tu contraseña?"** e introduce tu correo electrónico. Recibirás un email con un enlace para restablecer tu contraseña.

### ¿Puedo tener más de un rol?
No. Cada usuario tiene un único rol asignado en el sistema.

### ¿Puedo cambiar mis datos personales?
Sí. Accede a **"Mi Perfil"** desde el menú lateral y podrás editar tu nombre, apellidos, email, teléfono, dirección y DNI.

### ¿Puedo usar la aplicación desde el móvil?
Sí. La aplicación es responsive y funciona correctamente en cualquier dispositivo con navegador web. El menú se convierte en un botón hamburguesa (☰) y las tablas permiten desplazamiento horizontal.

### ¿En qué idiomas está disponible?
La aplicación está disponible en **español**, **inglés** y **rumano**. Puedes cambiar el idioma desde el selector en la cabecera en cualquier momento.

### ¿Quién decide mi rol?
Durante el registro tú eliges tu rol (Gerente, Capataz o Trabajador). Si necesitas cambiarlo posteriormente, el administrador del sistema puede modificarlo desde su panel.

### ¿Mis datos están seguros?
Sí. La aplicación utiliza Supabase como backend, que implementa autenticación segura mediante JWT y políticas de seguridad a nivel de fila (RLS) para que cada usuario solo pueda acceder a los datos que le corresponden según su rol.

### ¿Qué navegadores son compatibles?
Google Chrome, Mozilla Firefox, Microsoft Edge y Safari en sus versiones más recientes.

### ¿Puedo eliminar mi cuenta?
No directamente. El administrador puede desactivar tu cuenta (baja lógica), pero los datos no se eliminan permanentemente de la base de datos.

---

**Agrogestión — Manual de Usuario**
Autor: Juan Francisco Hurtado Pérez
Ciclo: CFGS Desarrollo de Aplicaciones Web (DAW)
Centro: IES Albarregas – Mérida (España)
Curso: 2024/2025 – 2025/2026
