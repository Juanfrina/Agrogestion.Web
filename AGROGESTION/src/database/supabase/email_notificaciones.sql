-- ============================================================
-- NOTIFICACIONES POR EMAIL — Agrogestión (Brevo / ex-Sendinblue)
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. Habilitar la extensión pg_net (permite hacer HTTP desde PostgreSQL)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Borrar trigger/función anterior (Resend) si existía
DROP TRIGGER IF EXISTS trg_email_notificacion ON notificaciones;
DROP FUNCTION IF EXISTS public.enviar_email_notificacion();

-- 3. Función que envía un email vía Brevo al destinatario
CREATE OR REPLACE FUNCTION public.enviar_email_notificacion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_email TEXT;
    v_nombre TEXT;
BEGIN
    SELECT email, nombre INTO v_email, v_nombre
    FROM perfiles
    WHERE id = NEW.id_destinatario;

    IF v_email IS NOT NULL THEN
        PERFORM net.http_post(
            url := 'https://api.brevo.com/v3/smtp/email',
            headers := jsonb_build_object(
                'api-key', '<<BREVO_API_KEY>>',  -- Reemplazar por tu API Key de Brevo
                'Content-Type', 'application/json'
            ),
            body := jsonb_build_object(
                'sender', jsonb_build_object('name', 'Agrogestión', 'email', 'juanfranhp13@gmail.com'),
                'to', jsonb_build_array(jsonb_build_object('email', v_email, 'name', COALESCE(v_nombre, ''))),
                'subject', '🔔 ' || NEW.titulo,
                'htmlContent',
                    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">'
                 || '<div style="background:#2d5016;padding:20px;text-align:center;border-radius:8px 8px 0 0">'
                 || '<h1 style="color:#fff;margin:0;font-size:24px">🌾 Agrogestión</h1>'
                 || '</div>'
                 || '<div style="background:#ffffff;padding:24px 20px;border:1px solid #e0e0e0;border-top:none">'
                 || '<p style="font-size:16px;color:#333">Hola <strong>' || COALESCE(v_nombre, 'usuario') || '</strong>,</p>'
                 || '<p style="font-size:15px;color:#555;line-height:1.6">' || COALESCE(NEW.mensaje, NEW.titulo) || '</p>'
                 || '<div style="text-align:center;margin:28px 0">'
                 || '<a href="https://agrogestion-web.vercel.app/login" '
                 || 'style="background:#2d5016;color:#ffffff;padding:14px 36px;text-decoration:none;'
                 || 'border-radius:6px;font-weight:bold;font-size:15px;display:inline-block">'
                 || 'Abrir Agrogestión</a>'
                 || '</div>'
                 || '</div>'
                 || '<div style="text-align:center;padding:16px;color:#999;font-size:12px">'
                 || '<p style="margin:0">Este es un mensaje automático de Agrogestión. No responder.</p>'
                 || '</div></div>'
            )
        );
    END IF;

    RETURN NEW;
END;
$$;

-- 4. Trigger: cada vez que se inserta una notificación → enviar email
CREATE TRIGGER trg_email_notificacion
    AFTER INSERT ON notificaciones
    FOR EACH ROW
    EXECUTE FUNCTION public.enviar_email_notificacion();
