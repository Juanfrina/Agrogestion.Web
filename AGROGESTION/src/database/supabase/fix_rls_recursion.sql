-- =============================================================
-- FIX: Recursión infinita en políticas RLS
-- =============================================================
-- Problema: las políticas de "tarea" hacen subquery a "tarea_trabajador"
-- y las de "tarea_trabajador" hacen subquery a "tarea" → bucle infinito.
-- Solución: funciones SECURITY DEFINER que esquivan RLS en las subconsultas.
-- =============================================================

-- 1. Funciones helper SECURITY DEFINER (ignoran RLS al ejecutarse)

-- IDs de tareas de un gerente
CREATE OR REPLACE FUNCTION public.tarea_ids_by_gerente(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT id_tarea FROM tarea WHERE id_gerente = uid AND fecha_baja IS NULL;
$$;

-- IDs de tareas de un capataz
CREATE OR REPLACE FUNCTION public.tarea_ids_by_capataz(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT id_tarea FROM tarea WHERE id_capataz = uid AND fecha_baja IS NULL;
$$;

-- IDs de tareas de un trabajador (desde tarea_trabajador)
CREATE OR REPLACE FUNCTION public.tarea_ids_by_trabajador(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT id_tarea FROM tarea_trabajador WHERE id_trabajador = uid AND fecha_baja IS NULL;
$$;

-- IDs de terrenos donde el capataz tiene tareas
CREATE OR REPLACE FUNCTION public.terreno_ids_by_capataz(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT DISTINCT id_terreno FROM tarea WHERE id_capataz = uid AND fecha_baja IS NULL;
$$;

-- IDs de terrenos donde el trabajador tiene tareas
CREATE OR REPLACE FUNCTION public.terreno_ids_by_trabajador(uid UUID)
RETURNS SETOF INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT DISTINCT t.id_terreno FROM tarea t
    JOIN tarea_trabajador tt ON tt.id_tarea = t.id_tarea
    WHERE tt.id_trabajador = uid
      AND tt.fecha_baja IS NULL AND t.fecha_baja IS NULL;
$$;


-- 2. Reemplazar políticas problemáticas en TAREA

DROP POLICY IF EXISTS "tarea_select_trabajador" ON tarea;
CREATE POLICY "tarea_select_trabajador"
    ON tarea FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 4
        AND id_tarea IN (SELECT public.tarea_ids_by_trabajador(auth.uid()))
    );


-- 3. Reemplazar políticas problemáticas en TAREA_TRABAJADOR

DROP POLICY IF EXISTS "tt_select_gerente" ON tarea_trabajador;
CREATE POLICY "tt_select_gerente"
    ON tarea_trabajador FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 2
        AND id_tarea IN (SELECT public.tarea_ids_by_gerente(auth.uid()))
    );

DROP POLICY IF EXISTS "tt_select_capataz" ON tarea_trabajador;
CREATE POLICY "tt_select_capataz"
    ON tarea_trabajador FOR SELECT TO authenticated
    USING (
        id_capataz_asigna = auth.uid()
        OR id_tarea IN (SELECT public.tarea_ids_by_capataz(auth.uid()))
    );


-- 4. Reemplazar políticas problemáticas en TERRENO

DROP POLICY IF EXISTS "terreno_select_capataz" ON terreno;
CREATE POLICY "terreno_select_capataz"
    ON terreno FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 3
        AND id_terreno IN (SELECT public.terreno_ids_by_capataz(auth.uid()))
    );

DROP POLICY IF EXISTS "terreno_select_trabajador" ON terreno;
CREATE POLICY "terreno_select_trabajador"
    ON terreno FOR SELECT TO authenticated
    USING (
        public.get_my_role() = 4
        AND id_terreno IN (SELECT public.terreno_ids_by_trabajador(auth.uid()))
    );


-- 5. Reemplazar políticas problemáticas en COMENTARIOS_TAREA

DROP POLICY IF EXISTS "comentarios_select_capataz" ON comentarios_tarea;
CREATE POLICY "comentarios_select_capataz"
    ON comentarios_tarea FOR SELECT TO authenticated
    USING (
        id_tarea IN (SELECT public.tarea_ids_by_capataz(auth.uid()))
    );

DROP POLICY IF EXISTS "comentarios_select_trabajador" ON comentarios_tarea;
CREATE POLICY "comentarios_select_trabajador"
    ON comentarios_tarea FOR SELECT TO authenticated
    USING (
        id_tarea IN (SELECT public.tarea_ids_by_trabajador(auth.uid()))
    );

DROP POLICY IF EXISTS "comentarios_insert_capataz" ON comentarios_tarea;
CREATE POLICY "comentarios_insert_capataz"
    ON comentarios_tarea FOR INSERT TO authenticated
    WITH CHECK (
        id_autor = auth.uid()
        AND id_tarea IN (SELECT public.tarea_ids_by_capataz(auth.uid()))
    );

DROP POLICY IF EXISTS "comentarios_insert_trabajador" ON comentarios_tarea;
CREATE POLICY "comentarios_insert_trabajador"
    ON comentarios_tarea FOR INSERT TO authenticated
    WITH CHECK (
        id_autor = auth.uid()
        AND id_tarea IN (SELECT public.tarea_ids_by_trabajador(auth.uid()))
    );
