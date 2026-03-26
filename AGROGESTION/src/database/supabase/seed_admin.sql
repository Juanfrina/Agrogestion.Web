-- =====================================================================
-- AGROGESTIÓN — CREAR USUARIO ADMINISTRADOR
-- =====================================================================
-- EJECUTAR DESPUÉS de schema.sql
--
-- PASOS:
--   1. Ve al Dashboard de Supabase → Authentication → Users
--   2. Pulsa "Add User" → "Create new user"
--   3. Rellena:
--        Email:    admin@agrogestion.es  (o el que quieras)
--        Password: (la que quieras, mínimo 6 caracteres)
--   4. Marca ✅ "Auto Confirm User"
--   5. Pulsa "Create User"
--   6. Ve al SQL Editor y ejecuta el bloque de abajo
-- =====================================================================


-- =============================================
-- PASO 6: Asignar rol ADMIN al usuario creado
-- =============================================
-- ⚠️  CAMBIA el email si usaste uno distinto

UPDATE perfiles
SET id_rol = 1
WHERE email = 'juanfranhp13@gmail.com';


-- =============================================
-- VERIFICACIÓN: Comprueba que se creó bien
-- =============================================

-- SELECT id, nombre, apellidos, email, id_rol
-- FROM perfiles
-- WHERE email = 'juanfranhp13@gmail.com';


-- =====================================================================
-- NOTA: El trigger on_auth_user_created habrá creado automáticamente
-- la fila en perfiles con los datos del raw_user_meta_data.
-- Como al crear desde el Dashboard NO se envía metadata personalizada,
-- el perfil tendrá nombre/apellidos/dni vacíos. Puedes completarlos:
-- =====================================================================

-- UPDATE perfiles
-- SET nombre    = 'Juan Francisco',
--     apellidos = 'Hurtado Perez',
--     dni       = '44788014E',
--     tlf       = '669864020',
--     direccion = 'Administración'
-- WHERE email = 'juanfranhp13@gmail.com';
