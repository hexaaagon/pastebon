-- Cron Job name cannot be edited
select
  cron.schedule (
    'paste-expires-check',
    '0 */6 * * *',
    '/* This Cron job will check if any paste is expired. */ CALL net.http_post(url := ''{{APP_URL}}/api/server/paste-expires-check'', headers := JSONB_BUILD_OBJECT(''Authorization'', ''{{REST_API_PASSWORD}}'') /* Don''t share this Authorization Key. */, timeout_milliseconds := 10000);'
  );