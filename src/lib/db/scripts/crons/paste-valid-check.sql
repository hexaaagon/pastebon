-- Cron Job name cannot be edited
select
  cron.schedule (
    'paste-valid-check',
    '0 */6 * * *',
    'CALL net.http_post(url := ''{{APP_URL}}/api/server/paste-valid-check'', headers := JSONB_BUILD_OBJECT(), timeout_milliseconds := 1000);'
  );