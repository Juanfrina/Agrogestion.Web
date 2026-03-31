-- =====================================================================
-- AGROGESTIÓN — SCRIPT COMPLETO DE BASE DE DATOS (SUPABASE)
-- =====================================================================
-- Autor: Juan Francisco Hurtado Pérez
-- Fecha: 2025/2026
-- Descripción: Script para crear desde cero la BD en Supabase.
--
-- INSTRUCCIONES:
--   1. Ve al SQL Editor de Supabase
--   2. Ejecuta PRIMERO la Parte 0 (limpieza) si ya tienes tablas
--   3. Luego ejecuta todo el resto de una sola vez (Partes 1-7)
--   4. Por último ejecuta seed_admin.sql para crear el admin
--
-- TABLAS (10):
--   rol, estados_tarea, perfiles, terreno, tarea,
--   gerente_capataz, tarea_trabajador, capataz_trabajador,
--   comentarios_tarea, notificaciones
--
-- FLUJO DE TAREA:
--   Gerente crea tarea (PENDIENTE) → asigna a capataz (ASIGNADA)
--   → capataz acepta (ACEPTADA) o rechaza (RECHAZADA)
--   → capataz trabaja (EN_PROGRESO) → termina (COMPLETADA)
--   Capataz puede asignar trabajadores → trabajador acepta/rechaza
--   Cualquiera puede dejar comentarios en la tarea
-- =====================================================================


-- =============================================================
-- PARTE 0: LIMPIEZA TOTAL (ejecutar solo si ya existen tablas)
-- =============================================================

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP TRIGGER IF EXISTS trg_notif_tarea_asignada_capataz ON tarea;
-- DROP TRIGGER IF EXISTS trg_notif_trabajador_asignado ON tarea_trabajador;

-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP FUNCTION IF EXISTS public.get_my_role();
-- DROP FUNCTION IF EXISTS public.is_admin();
-- DROP FUNCTION IF EXISTS public.is_email_taken(TEXT);
-- DROP FUNCTION IF EXISTS public.notificar_tarea_capataz();
-- DROP FUNCTION IF EXISTS public.notificar_trabajador_asignado();

-- DROP TABLE IF EXISTS notificaciones CASCADE;
-- DROP TABLE IF EXISTS comentarios_tarea CASCADE;
-- DROP TABLE IF EXISTS capataz_trabajador CASCADE;
-- DROP TABLE IF EXISTS tarea_trabajador CASCADE;
-- DROP TABLE IF EXISTS gerente_capataz CASCADE;
-- DROP TABLE IF EXISTS tarea CASCADE;
-- DROP TABLE IF EXISTS terreno CASCADE;
-- DROP TABLE IF EXISTS perfiles CASCADE;
-- DROP TABLE IF EXISTS estados_tarea CASCADE;
-- DROP TABLE IF EXISTS rol CASCADE;


-- =============================================================
-- PARTE 1: TABLAS SIN DEPENDENCIAS
-- =============================================================

-- Tabla de roles (valores fijos)
CREATE TABLE rol (
    id_rol      INTEGER      NOT NULL,
    nombre      VARCHAR(50)  NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    CONSTRAINT pk_rol PRIMARY KEY (id_rol),
    CONSTRAINT chk_rol_validos CHECK (id_rol IN (1, 2, 3, 4))
);

-- Tabla de estados de tarea (flujo completo)
CREATE TABLE estados_tarea (
    id_estado   SERIAL       NOT NULL,
    nombre      VARCHAR(50)  NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    CONSTRAINT pk_estados_tarea PRIMARY KEY (id_estado)
);


-- =============================================================
-- PARTE 2: TABLA PERFILES (depende de rol y auth.users)
-- =============================================================

CREATE TABLE perfiles (
    id         UUID         NOT NULL,
    nombre     VARCHAR(100) NOT NULL,
    apellidos  VARCHAR(100) NOT NULL,
    dni        VARCHAR(9)   UNIQUE NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    tlf        VARCHAR(15)  NOT NULL,
    direccion  VARCHAR(255) NOT NULL,
    id_rol     INTEGER      NOT NULL DEFAULT 4,
    fecha_baja DATE         DEFAULT NULL,
    created_at TIMESTAMPTZ  DEFAULT NOW(),
    CONSTRAINT pk_perfiles PRIMARY KEY (id),
    CONSTRAINT fk_perfiles_auth FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_perfiles_rol  FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);


-- =============================================================
-- PARTE 3: TABLA TERRENO (depende de perfiles)
-- =============================================================

CREATE TABLE terreno (
    id_terreno    SERIAL       NOT NULL,
    nombre        VARCHAR(100) NOT NULL,
    ubicacion     VARCHAR(255) NOT NULL,
    tipo_cultivo  VARCHAR(100) NOT NULL,
    estado        VARCHAR(20)  NOT NULL DEFAULT 'activo',
    id_gestor     UUID         NOT NULL,
    fecha_baja    DATE         DEFAULT NULL,
    created_at    TIMESTAMPTZ  DEFAULT NOW(),
    CONSTRAINT pk_terreno PRIMARY KEY (id_terreno),
    CONSTRAINT fk_terreno_gestor FOREIGN KEY (id_gestor) REFERENCES perfiles(id)
);


-- =============================================================
-- PARTE 4: TABLA TAREA (depende de terreno, perfiles, estados)
-- =============================================================

CREATE TABLE tarea (
    id_tarea       SERIAL        NOT NULL,
    nombre         VARCHAR(100)  NOT NULL,
    descripcion    TEXT,
    fecha_inicio   DATE          NOT NULL,
    fecha_fin      DATE          NOT NULL,
    id_terreno     INTEGER       NOT NULL,
    id_gerente     UUID          NOT NULL,
    id_capataz     UUID,
    id_estado      INTEGER       DEFAULT 1,
    fecha_baja     DATE          DEFAULT NULL,
    created_at     TIMESTAMPTZ   DEFAULT NOW(),
    updated_at     TIMESTAMPTZ   DEFAULT NOW(),
    CONSTRAINT pk_tarea PRIMARY KEY (id_tarea),
    CONSTRAINT fk_tarea_terreno FOREIGN KEY (id_terreno) REFERENCES terreno(id_terreno),
    CONSTRAINT fk_tarea_gerente FOREIGN KEY (id_gerente) REFERENCES perfiles(id),
    CONSTRAINT fk_tarea_capataz FOREIGN KEY (id_capataz) REFERENCES perfiles(id),
    CONSTRAINT fk_tarea_estado  FOREIGN KEY (id_estado)  REFERENCES estados_tarea(id_estado),
    CONSTRAINT chk_fechas CHECK (fecha_fin >= fecha_inicio)
);


-- =============================================================
-- PARTE 5: TABLAS DE RELACIÓN
-- =============================================================

-- Relación Gerente ↔ Capataz
CREATE TABLE gerente_capataz (
    id_gerente        UUID NOT NULL,
    id_capataz        UUID NOT NULL,
    fecha_asignacion  DATE DEFAULT CURRENT_DATE,
    fecha_baja        DATE DEFAULT NULL,
    CONSTRAINT pk_gerente_capataz PRIMARY KEY (id_gerente, id_capataz),
    CONSTRAINT fk_gc_gerente FOREIGN KEY (id_gerente) REFERENCES perfiles(id),
    CONSTRAINT fk_gc_capataz FOREIGN KEY (id_capataz) REFERENCES perfiles(id)
);

-- Relación Tarea ↔ Trabajador (con estado de aceptación)
CREATE TABLE tarea_trabajador (
    id_tarea            INTEGER      NOT NULL,
    id_trabajador       UUID         NOT NULL,
    id_capataz_asigna   UUID         NOT NULL,
    estado              VARCHAR(20)  NOT NULL DEFAULT 'PENDIENTE',
    fecha_asignacion    DATE         DEFAULT CURRENT_DATE,
    fecha_respuesta     TIMESTAMPTZ,
    fecha_baja          DATE         DEFAULT NULL,
    CONSTRAINT pk_tarea_trabajador PRIMARY KEY (id_tarea, id_trabajador),
    CONSTRAINT fk_tt_tarea      FOREIGN KEY (id_tarea)          REFERENCES tarea(id_tarea),
    CONSTRAINT fk_tt_trabajador FOREIGN KEY (id_trabajador)     REFERENCES perfiles(id),
    CONSTRAINT fk_tt_capataz    FOREIGN KEY (id_capataz_asigna) REFERENCES perfiles(id),
    CONSTRAINT chk_tt_estado CHECK (estado IN ('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'COMPLETADA'))
);

-- Relación Capataz ↔ Trabajador (asignación estable)
CREATE TABLE capataz_trabajador (
    id_capataz        UUID NOT NULL,
    id_trabajador     UUID NOT NULL,
    fecha_asignacion  DATE DEFAULT CURRENT_DATE,
    fecha_baja        DATE DEFAULT NULL,
    CONSTRAINT pk_capataz_trabajador PRIMARY KEY (id_capataz, id_trabajador),
    CONSTRAINT fk_ct_capataz    FOREIGN KEY (id_capataz)    REFERENCES perfiles(id),
    CONSTRAINT fk_ct_trabajador FOREIGN KEY (id_trabajador) REFERENCES perfiles(id)
);


-- =============================================================
-- PARTE 6: COMENTARIOS DE TAREA
-- =============================================================

CREATE TABLE comentarios_tarea (
    id_comentario  SERIAL       NOT NULL,
    id_tarea       INTEGER      NOT NULL,
    id_autor       UUID         NOT NULL,
    contenido      TEXT         NOT NULL,
    created_at     TIMESTAMPTZ  DEFAULT NOW(),
    CONSTRAINT pk_comentarios_tarea PRIMARY KEY (id_comentario),
    CONSTRAINT fk_ct_tarea FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea) ON DELETE CASCADE,
    CONSTRAINT fk_ct_autor FOREIGN KEY (id_autor) REFERENCES perfiles(id)
);


-- =============================================================
-- PARTE 7: NOTIFICACIONES
-- =============================================================

CREATE TABLE notificaciones (
    id_notificacion  SERIAL       NOT NULL,
    id_destinatario  UUID         NOT NULL,
    tipo             VARCHAR(50)  NOT NULL,
    titulo           VARCHAR(200) NOT NULL,
    mensaje          TEXT,
    id_tarea         INTEGER,
    leida            BOOLEAN      DEFAULT FALSE,
    created_at       TIMESTAMPTZ  DEFAULT NOW(),
    CONSTRAINT pk_notificaciones PRIMARY KEY (id_notificacion),
    CONSTRAINT fk_notif_destinatario FOREIGN KEY (id_destinatario) REFERENCES perfiles(id),
    CONSTRAINT fk_notif_tarea FOREIGN KEY (id_tarea) REFERENCES tarea(id_tarea) ON DELETE CASCADE,
    CONSTRAINT chk_tipo_notif CHECK (tipo IN (
        'TAREA_ASIGNADA',
        'TAREA_ACEPTADA',
        'TAREA_RECHAZADA',
        'TAREA_EN_PROGRESO',
        'TAREA_COMPLETADA',
        'TRABAJADOR_ASIGNADO',
        'TRABAJADOR_ACEPTO',
        'TRABAJADOR_RECHAZO',
        'COMENTARIO_NUEVO',
        'ASOCIACION_NUEVA'
    ))
);


-- =============================================================
-- PARTE 8: FUNCIONES AUXILIARES
-- =============================================================

-- Función: obtener el rol del usuario autenticado
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id_rol
    FROM perfiles
    WHERE id = auth.uid()
      AND fecha_baja IS NULL;
$$;

-- Función: comprobar si es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM perfiles
        WHERE id = auth.uid()
          AND id_rol = 1
          AND fecha_baja IS NULL
    );
$$;

-- Función RPC: comprobar si un email ya existe
CREATE OR REPLACE FUNCTION public.is_email_taken(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM perfiles WHERE email = email_to_check
    );
$$;

-- Funciones helper para romper recursión en RLS
-- (SECURITY DEFINER ignora las políticas RLS al ejecutarse)

CREATE OR REPLACE FUNCTION public.tarea_ids_by_gerente(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT id_tarea FROM tarea WHERE id_gerente = uid AND fecha_baja IS NULL;
$$;

CREATE OR REPLACE FUNCTION public.tarea_ids_by_capataz(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT id_tarea FROM tarea WHERE id_capataz = uid AND fecha_baja IS NULL;
$$;

CREATE OR REPLACE FUNCTION public.tarea_ids_by_trabajador(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT id_tarea FROM tarea_trabajador WHERE id_trabajador = uid AND fecha_baja IS NULL;
$$;

CREATE OR REPLACE FUNCTION public.terreno_ids_by_capataz(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT DISTINCT id_terreno FROM tarea WHERE id_capataz = uid AND fecha_baja IS NULL;
$$;

CREATE OR REPLACE FUNCTION public.terreno_ids_by_trabajador(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT DISTINCT t.id_terreno FROM tarea t
    JOIN tarea_trabajador tt ON tt.id_tarea = t.id_tarea
    WHERE tt.id_trabajador = uid
      AND tt.fecha_baja IS NULL AND t.fecha_baja IS NULL;
$$;

-- Trigger: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.perfiles (id, nombre, apellidos, dni, email, tlf, direccion, id_rol)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
        COALESCE(NEW.raw_user_meta_data->>'apellidos', ''),
        COALESCE(NEW.raw_user_meta_data->>'dni', ''),
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'tlf', ''),
        COALESCE(NEW.raw_user_meta_data->>'direccion', ''),
        COALESCE((NEW.raw_user_meta_data->>'id_rol')::INTEGER, 4)
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- =============================================================
-- PARTE 9: TRIGGERS DE NOTIFICACIÓN AUTOMÁTICA
-- =============================================================

-- Cuando se asigna un capataz a una tarea → notificar al capataz
CREATE OR REPLACE FUNCTION public.notificar_tarea_capataz()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_nombre_tarea VARCHAR(100);
BEGIN
    -- Solo notificar si se asignó un capataz (INSERT con capataz, o UPDATE que cambia capataz)
    IF NEW.id_capataz IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.id_capataz IS DISTINCT FROM NEW.id_capataz) THEN
        SELECT nombre INTO v_nombre_tarea FROM tarea WHERE id_tarea = NEW.id_tarea;
        INSERT INTO notificaciones (id_destinatario, tipo, titulo, mensaje, id_tarea)
        VALUES (
            NEW.id_capataz,
            'TAREA_ASIGNADA',
            'Nueva tarea asignada: ' || COALESCE(v_nombre_tarea, ''),
            'Se te ha asignado la tarea "' || COALESCE(v_nombre_tarea, '') || '". Revísala y acepta o rechaza.',
            NEW.id_tarea
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notif_tarea_asignada_capataz
    AFTER INSERT OR UPDATE OF id_capataz ON tarea
    FOR EACH ROW
    EXECUTE FUNCTION public.notificar_tarea_capataz();


-- Cuando se asigna un trabajador a una tarea → notificar al trabajador
CREATE OR REPLACE FUNCTION public.notificar_trabajador_asignado()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_nombre_tarea VARCHAR(100);
BEGIN
    SELECT nombre INTO v_nombre_tarea FROM tarea WHERE id_tarea = NEW.id_tarea;
    INSERT INTO notificaciones (id_destinatario, tipo, titulo, mensaje, id_tarea)
    VALUES (
        NEW.id_trabajador,
        'TRABAJADOR_ASIGNADO',
        'Asignado a tarea: ' || COALESCE(v_nombre_tarea, ''),
        'Se te ha asignado como trabajador en la tarea "' || COALESCE(v_nombre_tarea, '') || '". Acepta o rechaza.',
        NEW.id_tarea
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notif_trabajador_asignado
    AFTER INSERT ON tarea_trabajador
    FOR EACH ROW
    EXECUTE FUNCTION public.notificar_trabajador_asignado();


-- =============================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- =============================================================

ALTER TABLE rol                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE estados_tarea       ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE terreno             ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarea               ENABLE ROW LEVEL SECURITY;
ALTER TABLE gerente_capataz     ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarea_trabajador    ENABLE ROW LEVEL SECURITY;
ALTER TABLE capataz_trabajador  ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios_tarea   ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones      ENABLE ROW LEVEL SECURITY;


-- =============================================================
-- POLÍTICAS: ROL
-- =============================================================

CREATE POLICY "rol_select_authenticated"
    ON rol FOR SELECT TO authenticated USING (true);


-- =============================================================
-- POLÍTICAS: ESTADOS_TAREA
-- =============================================================

CREATE POLICY "estados_select_authenticated"
    ON estados_tarea FOR SELECT TO authenticated USING (true);


-- =============================================================
-- POLÍTICAS: PERFILES
-- =============================================================

-- Cada usuario puede ver su propio perfil
CREATE POLICY "perfiles_select_self"
    ON perfiles FOR SELECT TO authenticated
    USING (id = auth.uid());

-- Admin puede ver todos los perfiles
CREATE POLICY "perfiles_select_admin"
    ON perfiles FOR SELECT TO authenticated
    USING (public.is_admin());

-- Admin puede insertar perfiles
CREATE POLICY "perfiles_insert_admin"
    ON perfiles FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

-- El propio usuario puede insertar su perfil al registrarse
CREATE POLICY "perfiles_insert_self"
    ON perfiles FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

-- Cada usuario puede actualizar su propio perfil
CREATE POLICY "perfiles_update_self"
    ON perfiles FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Admin puede actualizar cualquier perfil
CREATE POLICY "perfiles_update_admin"
    ON perfiles FOR UPDATE TO authenticated
    USING (public.is_admin());

-- Admin puede eliminar cualquier perfil
CREATE POLICY "perfiles_delete_admin"
    ON perfiles FOR DELETE TO authenticated
    USING (public.is_admin());

-- Gerente puede ver los capataces que tiene asignados
CREATE POLICY "perfiles_select_gerente_capataces"
    ON perfiles FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 2
        AND id IN (
            SELECT id_capataz FROM gerente_capataz
            WHERE id_gerente = auth.uid() AND fecha_baja IS NULL
        )
    );

-- Gerente puede ver los trabajadores de sus capataces
CREATE POLICY "perfiles_select_gerente_trabajadores"
    ON perfiles FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 2
        AND id IN (
            SELECT ct.id_trabajador FROM capataz_trabajador ct
            JOIN gerente_capataz gc ON gc.id_capataz = ct.id_capataz
            WHERE gc.id_gerente = auth.uid()
              AND gc.fecha_baja IS NULL AND ct.fecha_baja IS NULL
        )
    );

-- Capataz puede ver los trabajadores que tiene asignados
CREATE POLICY "perfiles_select_capataz_trabajadores"
    ON perfiles FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 3
        AND id IN (
            SELECT id_trabajador FROM capataz_trabajador
            WHERE id_capataz = auth.uid() AND fecha_baja IS NULL
        )
    );

-- Gerente puede ver TODOS los capataces disponibles (para asociarse)
CREATE POLICY "perfiles_select_gerente_all_capataces"
    ON perfiles FOR SELECT TO authenticated
    USING (public.get_my_role() = 2 AND id_rol = 3 AND fecha_baja IS NULL);

-- Capataz puede ver TODOS los trabajadores disponibles (para asociarse)
CREATE POLICY "perfiles_select_capataz_all_trabajadores"
    ON perfiles FOR SELECT TO authenticated
    USING (public.get_my_role() = 3 AND id_rol = 4 AND fecha_baja IS NULL);

-- Capataz puede ver a los gerentes que le tienen asignado
CREATE POLICY "perfiles_select_capataz_sus_gerentes"
    ON perfiles FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 3 AND id_rol = 2
        AND id IN (
            SELECT id_gerente FROM gerente_capataz
            WHERE id_capataz = auth.uid() AND fecha_baja IS NULL
        )
    );

-- Trabajador puede ver a los capataces que le tienen asignado
CREATE POLICY "perfiles_select_trabajador_sus_capataces"
    ON perfiles FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 4 AND id_rol = 3
        AND id IN (
            SELECT id_capataz FROM capataz_trabajador
            WHERE id_trabajador = auth.uid() AND fecha_baja IS NULL
        )
    );


-- =============================================================
-- POLÍTICAS: TERRENO
-- =============================================================

CREATE POLICY "terreno_select_admin"
    ON terreno FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "terreno_select_gerente"
    ON terreno FOR SELECT TO authenticated
    USING (id_gestor = auth.uid());

CREATE POLICY "terreno_select_capataz"
    ON terreno FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 3
        AND id_terreno IN (SELECT public.terreno_ids_by_capataz(auth.uid()))
    );

CREATE POLICY "terreno_select_trabajador"
    ON terreno FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 4
        AND id_terreno IN (SELECT public.terreno_ids_by_trabajador(auth.uid()))
    );

CREATE POLICY "terreno_insert_gerente"
    ON terreno FOR INSERT TO authenticated
    WITH CHECK (id_gestor = auth.uid() AND public.get_my_role() = 2);

CREATE POLICY "terreno_insert_admin"
    ON terreno FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "terreno_update_gerente"
    ON terreno FOR UPDATE TO authenticated
    USING (id_gestor = auth.uid()) WITH CHECK (id_gestor = auth.uid());

CREATE POLICY "terreno_update_admin"
    ON terreno FOR UPDATE TO authenticated
    USING (public.is_admin());

CREATE POLICY "terreno_delete_admin"
    ON terreno FOR DELETE TO authenticated
    USING (public.is_admin());

CREATE POLICY "terreno_delete_gerente"
    ON terreno FOR DELETE TO authenticated
    USING (id_gestor = auth.uid());


-- =============================================================
-- POLÍTICAS: TAREA
-- =============================================================

CREATE POLICY "tarea_select_admin"
    ON tarea FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "tarea_select_gerente"
    ON tarea FOR SELECT TO authenticated
    USING (id_gerente = auth.uid());

CREATE POLICY "tarea_select_capataz"
    ON tarea FOR SELECT TO authenticated
    USING (id_capataz = auth.uid());

CREATE POLICY "tarea_select_trabajador"
    ON tarea FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 4
        AND id_tarea IN (SELECT public.tarea_ids_by_trabajador(auth.uid()))
    );

CREATE POLICY "tarea_insert_gerente"
    ON tarea FOR INSERT TO authenticated
    WITH CHECK (id_gerente = auth.uid() AND public.get_my_role() = 2);

CREATE POLICY "tarea_insert_admin"
    ON tarea FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

-- Gerente puede actualizar sus tareas (asignar capataz, modificar datos)
CREATE POLICY "tarea_update_gerente"
    ON tarea FOR UPDATE TO authenticated
    USING (id_gerente = auth.uid()) WITH CHECK (id_gerente = auth.uid());

-- Capataz puede actualizar sus tareas (aceptar, rechazar, cambiar estado)
CREATE POLICY "tarea_update_capataz"
    ON tarea FOR UPDATE TO authenticated
    USING (id_capataz = auth.uid()) WITH CHECK (id_capataz = auth.uid());

CREATE POLICY "tarea_update_admin"
    ON tarea FOR UPDATE TO authenticated
    USING (public.is_admin());

CREATE POLICY "tarea_delete_admin"
    ON tarea FOR DELETE TO authenticated
    USING (public.is_admin());

CREATE POLICY "tarea_delete_gerente"
    ON tarea FOR DELETE TO authenticated
    USING (id_gerente = auth.uid());


-- =============================================================
-- POLÍTICAS: GERENTE_CAPATAZ
-- =============================================================

CREATE POLICY "gc_select_admin"
    ON gerente_capataz FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "gc_select_gerente"
    ON gerente_capataz FOR SELECT TO authenticated
    USING (id_gerente = auth.uid());

CREATE POLICY "gc_select_capataz"
    ON gerente_capataz FOR SELECT TO authenticated
    USING (id_capataz = auth.uid());

CREATE POLICY "gc_insert_gerente"
    ON gerente_capataz FOR INSERT TO authenticated
    WITH CHECK (id_gerente = auth.uid() AND public.get_my_role() = 2);

CREATE POLICY "gc_insert_admin"
    ON gerente_capataz FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "gc_update_gerente"
    ON gerente_capataz FOR UPDATE TO authenticated
    USING (id_gerente = auth.uid());

CREATE POLICY "gc_update_admin"
    ON gerente_capataz FOR UPDATE TO authenticated
    USING (public.is_admin());

CREATE POLICY "gc_delete_gerente"
    ON gerente_capataz FOR DELETE TO authenticated
    USING (id_gerente = auth.uid());

CREATE POLICY "gc_delete_admin"
    ON gerente_capataz FOR DELETE TO authenticated
    USING (public.is_admin());


-- =============================================================
-- POLÍTICAS: TAREA_TRABAJADOR
-- =============================================================

CREATE POLICY "tt_select_admin"
    ON tarea_trabajador FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "tt_select_gerente"
    ON tarea_trabajador FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 2
        AND id_tarea IN (SELECT public.tarea_ids_by_gerente(auth.uid()))
    );

CREATE POLICY "tt_select_capataz"
    ON tarea_trabajador FOR SELECT TO authenticated
    USING (
        id_capataz_asigna = auth.uid()
        OR id_tarea IN (SELECT public.tarea_ids_by_capataz(auth.uid()))
    );

CREATE POLICY "tt_select_trabajador"
    ON tarea_trabajador FOR SELECT TO authenticated
    USING (id_trabajador = auth.uid());

CREATE POLICY "tt_insert_capataz"
    ON tarea_trabajador FOR INSERT TO authenticated
    WITH CHECK (id_capataz_asigna = auth.uid() AND public.get_my_role() = 3);

CREATE POLICY "tt_insert_admin"
    ON tarea_trabajador FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

-- Capataz puede actualizar asignaciones que hizo
CREATE POLICY "tt_update_capataz"
    ON tarea_trabajador FOR UPDATE TO authenticated
    USING (id_capataz_asigna = auth.uid());

-- Trabajador puede actualizar SU propia asignación (para aceptar/rechazar)
CREATE POLICY "tt_update_trabajador"
    ON tarea_trabajador FOR UPDATE TO authenticated
    USING (id_trabajador = auth.uid())
    WITH CHECK (id_trabajador = auth.uid());

CREATE POLICY "tt_update_admin"
    ON tarea_trabajador FOR UPDATE TO authenticated
    USING (public.is_admin());

CREATE POLICY "tt_delete_capataz"
    ON tarea_trabajador FOR DELETE TO authenticated
    USING (id_capataz_asigna = auth.uid());

CREATE POLICY "tt_delete_admin"
    ON tarea_trabajador FOR DELETE TO authenticated
    USING (public.is_admin());


-- =============================================================
-- POLÍTICAS: CAPATAZ_TRABAJADOR
-- =============================================================

CREATE POLICY "ct_select_admin"
    ON capataz_trabajador FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "ct_select_capataz"
    ON capataz_trabajador FOR SELECT TO authenticated
    USING (id_capataz = auth.uid());

CREATE POLICY "ct_select_trabajador"
    ON capataz_trabajador FOR SELECT TO authenticated
    USING (id_trabajador = auth.uid());

CREATE POLICY "ct_select_gerente"
    ON capataz_trabajador FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 2
        AND id_capataz IN (
            SELECT id_capataz FROM gerente_capataz
            WHERE id_gerente = auth.uid() AND fecha_baja IS NULL
        )
    );

CREATE POLICY "ct_insert_capataz"
    ON capataz_trabajador FOR INSERT TO authenticated
    WITH CHECK (id_capataz = auth.uid() AND public.get_my_role() = 3);

CREATE POLICY "ct_insert_admin"
    ON capataz_trabajador FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "ct_update_capataz"
    ON capataz_trabajador FOR UPDATE TO authenticated
    USING (id_capataz = auth.uid());

CREATE POLICY "ct_update_admin"
    ON capataz_trabajador FOR UPDATE TO authenticated
    USING (public.is_admin());

CREATE POLICY "ct_delete_capataz"
    ON capataz_trabajador FOR DELETE TO authenticated
    USING (id_capataz = auth.uid());

CREATE POLICY "ct_delete_admin"
    ON capataz_trabajador FOR DELETE TO authenticated
    USING (public.is_admin());


-- =============================================================
-- POLÍTICAS: COMENTARIOS_TAREA
-- =============================================================

-- Puede ver comentarios quien tenga acceso a la tarea
CREATE POLICY "comentarios_select_admin"
    ON comentarios_tarea FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "comentarios_select_gerente"
    ON comentarios_tarea FOR SELECT TO authenticated
    USING (
        id_tarea IN (SELECT id_tarea FROM tarea WHERE id_gerente = auth.uid())
    );

CREATE POLICY "comentarios_select_capataz"
    ON comentarios_tarea FOR SELECT TO authenticated
    USING (
        id_tarea IN (SELECT public.tarea_ids_by_capataz(auth.uid()))
    );

CREATE POLICY "comentarios_select_trabajador"
    ON comentarios_tarea FOR SELECT TO authenticated
    USING (
        id_tarea IN (SELECT public.tarea_ids_by_trabajador(auth.uid()))
    );

-- Cualquier usuario involucrado en la tarea puede dejar comentarios
CREATE POLICY "comentarios_insert_gerente"
    ON comentarios_tarea FOR INSERT TO authenticated
    WITH CHECK (
        id_autor = auth.uid()
        AND id_tarea IN (SELECT id_tarea FROM tarea WHERE id_gerente = auth.uid())
    );

CREATE POLICY "comentarios_insert_capataz"
    ON comentarios_tarea FOR INSERT TO authenticated
    WITH CHECK (
        id_autor = auth.uid()
        AND id_tarea IN (SELECT public.tarea_ids_by_capataz(auth.uid()))
    );

CREATE POLICY "comentarios_insert_trabajador"
    ON comentarios_tarea FOR INSERT TO authenticated
    WITH CHECK (
        id_autor = auth.uid()
        AND id_tarea IN (SELECT public.tarea_ids_by_trabajador(auth.uid()))
    );

CREATE POLICY "comentarios_insert_admin"
    ON comentarios_tarea FOR INSERT TO authenticated
    WITH CHECK (id_autor = auth.uid() AND public.is_admin());

-- Solo el autor puede eliminar su comentario
CREATE POLICY "comentarios_delete_self"
    ON comentarios_tarea FOR DELETE TO authenticated
    USING (id_autor = auth.uid());

CREATE POLICY "comentarios_delete_admin"
    ON comentarios_tarea FOR DELETE TO authenticated
    USING (public.is_admin());


-- =============================================================
-- POLÍTICAS: NOTIFICACIONES
-- =============================================================

-- Cada usuario solo ve sus propias notificaciones
CREATE POLICY "notif_select_self"
    ON notificaciones FOR SELECT TO authenticated
    USING (id_destinatario = auth.uid());

-- Admin puede ver todas
CREATE POLICY "notif_select_admin"
    ON notificaciones FOR SELECT TO authenticated
    USING (public.is_admin());

-- El sistema crea notificaciones (via triggers SECURITY DEFINER)
-- pero también permitimos inserción para los roles que notifican
CREATE POLICY "notif_insert_authenticated"
    ON notificaciones FOR INSERT TO authenticated
    WITH CHECK (true);

-- Cada usuario puede marcar como leída sus notificaciones
CREATE POLICY "notif_update_self"
    ON notificaciones FOR UPDATE TO authenticated
    USING (id_destinatario = auth.uid())
    WITH CHECK (id_destinatario = auth.uid());

-- Cada usuario puede eliminar sus notificaciones
CREATE POLICY "notif_delete_self"
    ON notificaciones FOR DELETE TO authenticated
    USING (id_destinatario = auth.uid());

CREATE POLICY "notif_delete_admin"
    ON notificaciones FOR DELETE TO authenticated
    USING (public.is_admin());


-- =============================================================
-- DATOS INICIALES (SEED)
-- =============================================================

INSERT INTO rol (id_rol, nombre, descripcion) VALUES
    (1, 'ADMIN',      'Administrador del sistema'),
    (2, 'GERENTE',    'Gerente de operaciones agrícolas'),
    (3, 'CAPATAZ',    'Supervisor de campo'),
    (4, 'TRABAJADOR', 'Trabajador de campo');

INSERT INTO estados_tarea (nombre, descripcion) VALUES
    ('PENDIENTE',    'Tarea creada por el gerente, sin capataz asignado'),
    ('ASIGNADA',     'Tarea asignada a un capataz, esperando su respuesta'),
    ('ACEPTADA',     'Capataz aceptó la tarea'),
    ('RECHAZADA',    'Capataz rechazó la tarea'),
    ('EN_PROGRESO',  'Tarea en ejecución'),
    ('COMPLETADA',   'Tarea finalizada exitosamente');


-- =============================================================
-- ÍNDICES PARA RENDIMIENTO
-- =============================================================

CREATE INDEX idx_perfiles_rol          ON perfiles(id_rol);
CREATE INDEX idx_perfiles_email        ON perfiles(email);
CREATE INDEX idx_terreno_gestor        ON terreno(id_gestor);
CREATE INDEX idx_tarea_gerente         ON tarea(id_gerente);
CREATE INDEX idx_tarea_capataz         ON tarea(id_capataz);
CREATE INDEX idx_tarea_terreno         ON tarea(id_terreno);
CREATE INDEX idx_tarea_estado          ON tarea(id_estado);
CREATE INDEX idx_gc_gerente            ON gerente_capataz(id_gerente);
CREATE INDEX idx_gc_capataz            ON gerente_capataz(id_capataz);
CREATE INDEX idx_tt_tarea              ON tarea_trabajador(id_tarea);
CREATE INDEX idx_tt_trabajador         ON tarea_trabajador(id_trabajador);
CREATE INDEX idx_ct_capataz            ON capataz_trabajador(id_capataz);
CREATE INDEX idx_ct_trabajador         ON capataz_trabajador(id_trabajador);
CREATE INDEX idx_comentarios_tarea     ON comentarios_tarea(id_tarea);
CREATE INDEX idx_comentarios_autor     ON comentarios_tarea(id_autor);
CREATE INDEX idx_notif_destinatario    ON notificaciones(id_destinatario);
CREATE INDEX idx_notif_leida           ON notificaciones(id_destinatario, leida);
CREATE INDEX idx_notif_tarea           ON notificaciones(id_tarea);
