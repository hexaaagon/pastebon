-- Cron Job name cannot be edited
select
  cron.schedule (
    'paste-valid-check',
    '0 */6 * * *',
    '/* This Cron job will check if any paste is valid */ CALL net.http_post(url := ''{{APP_URL}}/api/server/paste-valid-check'', headers := JSONB_BUILD_OBJECT(''Authorization'', ''{{REST_API_PASSWORD}}'') /* Don''t share this Authorization Key. */, timeout_milliseconds := 10000);'
  );