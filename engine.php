<?php

$startTime = explode(' ', microtime());
$startTime = $startTime[1] + $startTime[0];

if (!defined('CONFIGS')) die('Const `CONFIGS` not defined at index.php at root project. '."<br />\n" . 'For example:' . "<br />\n" . 'define(\'CONFIGS\', \'./configs/configs.php\');');

if (!defined('TEMP')) die('Const `TEMP` not defined at index.php at root project. ' . "<br />\n" . 'For example:' . "<br />\n" .' define(\'TEMP\', \'./temp/\');');

if (!file_exists(CONFIGS) || !is_file(CONFIGS)) die('Configs file does not exists `' . CONFIGS . '`');

if (getenv('APPLICATION_ENV') !== false) {
  define('APPLICATION_ENV', getenv('APPLICATION_ENV'));
} else {
  define('APPLICATION_ENV', 'production');
}

session_start();
header('Content-type: text/html; charset=utf8');
define('CLASSES', ENGINE . 'classes/');

require_once CLASSES . 'clear_cache.php';
require_once CLASSES . 'validation_exception.php';
require_once CLASSES . 'page_not_found_exception.php';


ClearCache::clear();

define('MODULES', ENGINE . 'modules/');
define('N', "\n");

if (isset($_SESSION['location'])) {
  $location = $_SESSION['location'];
  unset($_SESSION['location']);
  header('Location: ' . $location, true, 301);
  die;
}

require_once CLASSES . 'type.php';
require_once CLASSES . 'log.php';
require_once CLASSES . 'json.php';
// SFLog::init();
require_once CLASSES . 'S3.php';
require_once CLASSES . 'array.php';
require_once CLASSES . 'models.php';
require_once CLASSES . 'uri.php';
require_once CLASSES . 'validate2.php';
require_once CLASSES . 'paths.php';
require_once CLASSES . 'text.php';
require_once CLASSES . 'socket.php';
require_once CLASSES . 'error.php';
require_once CLASSES . 'image.php';
require_once CLASSES . 'mail.php';
require_once CLASSES . 'modules.php';

if (!file_exists(ROOT . '.htaccess')) {
  @copy(ENGINE . '_htaccess', ROOT . '.htaccess');

  if (!file_exists(ROOT . '.htaccess')) {
    die("There is not .htaccess file at the root. You may copy from ./engine");
  }

  SFResponse::refresh();
}

try {
  SFResponse::initRedirData();

  if (!file_exists(CONFIGS)) die('Not exists configsPath: ' . CONFIGS);
  include CONFIGS;

  SFModules::checkModules();

  if (SFModules::main()) {
    SFResponse::render();
  }

  if (SFResponse::isWorking()) {
    if (file_exists(ACTIONS . '__before.php')) {
      SFResponse::run(ACTIONS . '__before');
    }

    $request = substr($_SERVER['REQUEST_URI'], 1, -1);

    if (!SFResponse::actionExists(ACTIONS . $request)) {
      throw new PageNotFoundException(ACTIONS . $request);
    }

    SFResponse::run(ACTIONS . $request);

    if (file_exists(ACTIONS . '__after.php')) {
      SFResponse::run(ACTIONS . '__after');
    }
  }

  SFResponse::render();
} catch (PageNotFoundException $e) {
  SFResponse::code('404');

  if (SFResponse::actionExists('404')) {
    SFResponse::run('404');
  } else {
    SFResponse::error(404, 'Page not found');
  }
} catch (ValidationException $e) {
  $e->message();
} catch (BaseException $e) {
  SFResponse::error(400, $e->message());
} catch (Exception $e) {
  SFResponse::error(400, $e->getMessage());
}
