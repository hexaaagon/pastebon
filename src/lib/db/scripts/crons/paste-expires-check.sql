-- Cron Job name cannot be edited
select
  cron.schedule (
    'paste-expires-check',
    '0 */6 * * *',
    'CALL net.http_post(url := ''{{APP_URL}}/api/server/paste-expires-check'', headers := JSONB_BUILD_OBJECT(), timeout_milliseconds := 1000);'
  );