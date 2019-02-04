<?php

function runEngine($configs) {
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

  if (isset($_SESSION['location'])) {
    $location = $_SESSION['location'];
    unset($_SESSION['location']);
    header('Location: ' . $location, true, 301);
    die;
  }

  require_once __DIR__ . '/classes/parseJSON.php';
  require_once __DIR__ . '/classes/S3.php';
  require_once __DIR__ . '/classes/models.php';
  require_once __DIR__ . '/classes/uri.php';
  require_once __DIR__ . '/classes/validate.php';
  require_once __DIR__ . '/classes/text.php';
  require_once __DIR__ . '/classes/socket.php';
  require_once __DIR__ . '/classes/image.php';
  require_once __DIR__ . '/classes/mail.php';
  require_once __DIR__ . '/classes/storages.php';
  require_once __DIR__ . '/classes/migrations.php';

  ClearCache::clear();

  try {
    $configs = Diagnostics::checkConfigs($configs);

    $url = isset($_GET[$configs['modrewrite-get-url']]) ?
      $_GET[$configs['modrewrite-get-url']] :
      '';
    SFURI::init($url);

    require_once __DIR__ . '/modules/Templater/Templater.php';

    SFTemplater::init([
      'path' => $configs['templates']
    ]);

    require_once __DIR__ . '/modules/ORM/ORM.php';

    Diagnostics::checkDatabaseConnection($configs['database']);

    require_once __DIR__ . '/modules/ERM/ERM.php';

    SFERM::init();

    SFStorages::init($configs['storages']);
    SFMigrations::init($configs);
    SFResponse::initRedirData();

    require_once __DIR__ . '/modules/Router/Router.php';

    SFRouter::init([
      'routes' => $configs['routes'],
      'languages' => $configs['languages'],
      'models' => $configs['models']
    ]);
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
  } catch (ValidateException $e) {
    $message = $e->getDetails();

    SFResponse::error(422, $message);
  } catch (BaseException $e) {
    SFResponse::error(400, $e->message());
  } catch (Exception $e) {
    SFResponse::error(400, $e->getMessage());
  }
}
