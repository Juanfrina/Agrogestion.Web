-- ============================================================
-- Migración: Añadir estado COMPLETADA a tarea_trabajador
-- ============================================================
-- El trabajador puede marcar su asignación como completada.
-- Ejecutar en Supabase SQL Editor.
-- ============================================================

ALTER TABLE tarea_trabajador DROP CONSTRAINT chk_tt_estado;

ALTER TABLE tarea_trabajador ADD CONSTRAINT chk_tt_estado
  CHECK (estado IN ('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'COMPLETADA'));
