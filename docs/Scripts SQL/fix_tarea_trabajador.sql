-- ============================================================
-- Migración: Añadir estado COMPLETADA a tarea_trabajador
-- ============================================================
-- El trabajador puede marcar su asignación como completada.
-- Ejecutar en Supabase SQL Editor.
-- ============================================================

ALTER TABLE tarea_trabajador DROP CONSTRAINT chk_tt_estado;

ALTER TABLE tarea_trabajador ADD CONSTRAINT chk_tt_estado
  CHECK (estado IN ('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'COMPLETADA'));


-- ============================================================
-- Reemplazar políticas problemáticas en TAREA_TRABAJADOR
-- ============================================================
CREATE POLICY perfiles_select_trabajador_sus_gerentes ON public.perfiles
  FOR SELECT TO authenticated
  USING (
    public.get_my_role() = 4
    AND id_rol = 2
    AND id IN (
      SELECT t.id_gerente
      FROM public.tarea t
      JOIN public.tarea_trabajador tt ON t.id_tarea = tt.id_tarea
      WHERE tt.id_trabajador = auth.uid()
        AND tt.fecha_baja IS NULL
    )
  );