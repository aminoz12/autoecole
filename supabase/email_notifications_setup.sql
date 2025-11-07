-- Email Notifications Setup for Reservations
-- This uses Supabase Edge Functions or external email service

-- Option 1: Using Supabase Edge Functions (Recommended)
-- You'll need to create an Edge Function to send emails
-- Deploy with: supabase functions deploy send-email

-- Option 2: Using Database Webhooks (Alternative)
-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to send email notification
CREATE OR REPLACE FUNCTION notify_reservation_created()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
  lesson_date TEXT;
  lesson_time TEXT;
  instructor_name TEXT;
BEGIN
  -- Get user email and details
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.user_id;

  SELECT full_name INTO user_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Get lesson details
  SELECT 
    to_char(lesson_date, 'DD/MM/YYYY'),
    start_time,
    instructors.name
  INTO lesson_date, lesson_time, instructor_name
  FROM lessons
  JOIN instructors ON lessons.instructor_id = instructors.id
  WHERE lessons.id = NEW.lesson_id;

  -- Log the notification (replace with actual email service call)
  -- Example: Use pg_net to call an external email API
  /*
  PERFORM net.http_post(
    url := 'https://your-email-service.com/send',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_API_KEY"}'::jsonb,
    body := json_build_object(
      'to', user_email,
      'subject', 'Confirmation de votre réservation',
      'html', format(
        '<h1>Bonjour %s,</h1>
        <p>Votre leçon de conduite a été confirmée !</p>
        <ul>
          <li><strong>Date:</strong> %s</li>
          <li><strong>Heure:</strong> %s</li>
          <li><strong>Moniteur:</strong> %s</li>
        </ul>
        <p>À bientôt !</p>',
        user_name, lesson_date, lesson_time, instructor_name
      )
    )::jsonb
  );
  */

  -- For now, just log it
  RAISE NOTICE 'Email would be sent to % for reservation %', user_email, NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new reservations
DROP TRIGGER IF EXISTS on_reservation_created ON reservations;
CREATE TRIGGER on_reservation_created
  AFTER INSERT ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION notify_reservation_created();

-- Create function for reservation status changes
CREATE OR REPLACE FUNCTION notify_reservation_status_changed()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
  status_text TEXT;
BEGIN
  -- Only notify on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get user email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.user_id;

  SELECT full_name INTO user_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Map status to French text
  CASE NEW.status
    WHEN 'confirmed' THEN status_text := 'confirmée';
    WHEN 'cancelled' THEN status_text := 'annulée';
    WHEN 'completed' THEN status_text := 'complétée';
    ELSE status_text := NEW.status;
  END CASE;

  -- Log the notification
  RAISE NOTICE 'Email would be sent to %: Reservation % - Status: %', 
    user_email, NEW.id, status_text;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for status changes
DROP TRIGGER IF EXISTS on_reservation_status_changed ON reservations;
CREATE TRIGGER on_reservation_status_changed
  AFTER UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION notify_reservation_status_changed();

-- Instructions for implementing actual email sending:
-- 
-- OPTION A: Supabase Edge Functions (Recommended)
-- 1. Create edge function: supabase functions new send-email
-- 2. Use Resend, SendGrid, or similar in the function
-- 3. Call from triggers using pg_net or invoke directly
--
-- OPTION B: External Webhook Service
-- 1. Use services like Zapier, Make.com, or n8n
-- 2. Configure webhook URL in Supabase
-- 3. Send POST requests from triggers
--
-- OPTION C: Direct SMTP (Not recommended for production)
-- 1. Use pg_net to call SMTP relay service
-- 2. Configure in environment variables
--
-- For production, we recommend using Resend.com:
-- - Simple API
-- - Good deliverability
-- - Free tier available
-- - Easy to integrate with Edge Functions

COMMENT ON FUNCTION notify_reservation_created() IS 
'Sends email notification when a new reservation is created. 
Replace RAISE NOTICE with actual email service call.';

COMMENT ON FUNCTION notify_reservation_status_changed() IS 
'Sends email notification when reservation status changes. 
Replace RAISE NOTICE with actual email service call.';

