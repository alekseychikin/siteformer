<?php

function runEngine($entryPoint) {
  $startTime = explode(' ', microtime());
  $startTime = $startTime[1] + $startTime[0];

  require_once __DIR__ . '/classes/diagnostics.php';

  Diagnostics::checkRequiredDirs();

  session_start();
  header('Content-type: text/html; charset=utf8');
  define('EOL', "\n");

  require_once __DIR__ . '/classes/ClearCache.php';
  require_once __DIR__ . '/classes/validate-exception.php';
  require_once __DIR__ . '/classes/page-not-found-exception.php';
  require_once __DIR__ . '/classes/text.php';
  require_once __DIR__ . '/classes/parseJSON.php';
  require_once __DIR__ . '/classes/S3.php';
  require_once __DIR__ . '/classes/models.php';
  require_once __DIR__ . '/classes/validate.php';
  require_once __DIR__ . '/classes/socket.php';
  require_once __DIR__ . '/classes/image.php';
  require_once __DIR__ . '/classes/mail.php';
  require_once __DIR__ . '/classes/storages.php';
  require_once __DIR__ . '/classes/migrations.php';

  require_once __DIR__ . '/modules/Templater/Templater.php';
  require_once __DIR__ . '/modules/ORM/ORM.php';
  require_once __DIR__ . '/modules/ERM/ERM.php';
  require_once __DIR__ . '/modules/Router/Router.php';

  ClearCache::clear();

  try {
    $entryPoint();
  } catch (ValidateException $e) {
    $message = $e->getDetails();

    SFResponse::error(422, $message);
  } catch (BaseException $e) {
    SFResponse::error(400, $e->message());
  } catch (Exception $e) {
    SFResponse::error(400, $e->getMessage());
  }

  try {
    SFRouter::route();

    SFResponse::render();
  } catch (PageNotFoundException $e) {
    println('PageNotFoundException');
  } catch (ValidateException $e) {
    $message = $e->getDetails();

    SFResponse::error(422, $message);
  } catch (BaseException $e) {
    SFResponse::error(400, $e->message());
  } catch (Exception $e) {
    SFResponse::error(400, $e->getMessage());
  }
}
