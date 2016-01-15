<?php

  $e = new Exception();
  $trace = $e->getTrace();
  if (!defined('CONFIGS')) die('Const `CONFIGS` not defined at index.php at root project. '."<br />\n".'For example:'."<br />\n".'define(\'CONFIGS\', \'./configs/configs.php\');');
  if (!defined('TEMP')) die('Const `TEMP` not defined at index.php at root project. '."<br />\n".'For example:'."<br />\n".'define(\'TEMP\', \'./temp/\');');
  if (!file_exists(CONFIGS) || !is_file(CONFIGS)) die('Configs file does not exists `'.CONFIGS.'`');
  define('ROOT', realpath(dirname($trace[0]['file'])).'/');
  define('ENGINE', realpath(dirname(__FILE__)).'/');
  if (getenv('APPLICATION_ENV') !== false) {
    define('APPLICATION_ENV', getenv('APPLICATION_ENV'));
  }
  else {
    define('APPLICATION_ENV', 'production');
  }

  session_start();
  date_default_timezone_set('Europe/Moscow');
  header('Content-type: text/html; charset=utf8');
  define('CLASSES', ENGINE.'classes/');
  require_once CLASSES.'base_exception.php';
  require_once CLASSES.'page_not_found_exception.php';
  require_once CLASSES.'error_handler.php';
  set_error_handler('errorHandler');

  // define('DATAPTH', ENGINE.'schemes/');
  // define('CONFIGS', ENGINE.'.configs/');
  // define('TYPES', ENGINE.'types/');
  // define('MODIFIERS', ENGINE.'modifiers/');
  define('MODULES', ENGINE.'modules/');
  // define('ADMINURL', 'cms');
  define('N', "\n");
  define('T', "\t");
  // define('EXT', '.php');

  if (isset($_SESSION['location'])) {
    $location = $_SESSION['location'];
    unset($_SESSION['location']);
    header('Location: '.$location, true, 301);
    die;
  }

  require_once CLASSES.'type.php';
  require_once CLASSES.'log.php';
  // SFLog::init();
  require_once CLASSES.'S3.php';
  require_once CLASSES.'array.php';
  require_once CLASSES.'models.php';
  require_once CLASSES.'response.php';
  require_once CLASSES.'uri.php';
  require_once CLASSES.'validate.php';
  require_once CLASSES.'paths.php';
  require_once CLASSES.'text.php';
  require_once CLASSES.'socket.php';
  require_once CLASSES.'error.php';
  require_once CLASSES.'image.php';
  require_once CLASSES.'mail.php';

  // require_once CLASSES.'data.php';
  // require_once CLASSES.'mysql.php';
  // require_once CLASSES.'orm-database.php';
  // require_once CLASSES.'orm.php';
  // require_once CLASSES.'uri.php';
  // require_once CLASSES.'templater.php';
  // require_once CLASSES.'admins.php';
  require_once CLASSES.'modules.php';

  if (!file_exists(ROOT.'.htaccess')) {
    @copy(ENGINE.'_htaccess', ROOT.'.htaccess');
    if (!file_exists(ROOT.'.htaccess')) {
      die("There is not .htaccess file at the root. You may copy from ./engine");
    }
    SFResponse::refresh();
  }

  try {
    SFResponse::initRedirData();

    SFLog::write('Requred all needed files');

    if (!file_exists(CONFIGS)) die('Not exists configsPath: '.CONFIGS);
    include CONFIGS;

    SFModules::checkModules();

    SFLog::write('Modules checked');

    SFModules::before();
    SFLog::write('Modules before ends');
    SFModules::after();
    SFLog::write('Modules after ends');

    if (SFResponse::isWorking()) {
      if (file_exists(ACTIONS . '__before.php')) {
        SFResponse::run(ACTIONS . '__before');
        SFLog::write('__before.php ends');
      }

      $request = substr($_SERVER['REQUEST_URI'], 1, -1);
      if (!SFResponse::actionExists(ACTIONS . $request)) {
        throw new PageNotFoundException(ACTIONS . $request);
      }
      SFResponse::run(ACTIONS . $request);
      SFLog::write('Default action ends');

      if (file_exists(ACTIONS . '__after.php')) {
        SFResponse::run(ACTIONS . '__after');
        SFLog::write('__after ends');
      }
    }
    SFLog::close();
  }
  catch (PageNotFoundException $e) {
    SFResponse::code('404');
    if (SFResponse::actionExists('404')) {
      SFResponse::run('404');
    }
    else {
      SFResponse::error(404, 'Page not found');
    }
  }
  catch (BaseException $e) {
    SFResponse::error(400, $e->message());
  }
  catch (Exception $e) {
    SFResponse::error(400, $e->getMessage());
  }

  // ORMDatabase::init($mysqlConfigs);

  // $dir = opendir(TYPES);
  // while ($file = readdir($dir)) {
    // if (file_exists(TYPES.$file.'/component'.EXT)) {
      // require_once TYPES.$file.'/component'.EXT;
    // }
  // }

  // $dir = opendir(MODIFIERS);
  // while ($file = readdir($dir)) {
    // if (strtolower(substr(strrchr($file, '.'), 1)) == 'php') {
      // require_once MODIFIERS.$file;
    // }
  // }

  // $dir = opendir(MODIFIERS.'default');
  // while ($file = readdir($dir)) {
    // if (strtolower(substr(strrchr($file, '.'), 1)) == 'php') {
      // require_once MODIFIERS.'default/'.$file;
    // }
  // }

  // SFModules::init();

  // SFParseURI::init();

  // if (SFParseURI::uri(0) == ADMINURL) {
    // $uri = include ENGINE.'routing'.EXT;
    // define('ACTIONS', ENGINE.'actions/');
    // define('TEMPLATES', ENGINE.'templates/');
    // define('TEMPLATES_C', ROOT.'.compile_templates/engine/');
  // }
  // else {
    // $uri = include ROOT.'routing'.EXT;
    // define('ACTIONS', ROOT.'actions/');
    // define('TEMPLATES', ROOT.'templates/');
    // define('TEMPLATES_C', ROOT.'.compile_templates/site/');
  // }

  // SFTemplater::init();
  // $result = SFParseURI::parse($uri);
  // if ($result != '404') {
    // foreach ($result['params'] as $field => $val) {
      // $$field = $val;
    // }

    // if (file_exists(ACTIONS.'_before'.EXT)) {
      // include ACTIONS.'_before'.EXT;
    // }

    // if (SFResponse::isPropagation()) {
      // if (file_exists(ACTIONS.$result['path'].EXT)) {
        // include ACTIONS.$result['path'].EXT;
      // }
    // }

    // if (SFResponse::isPropagation()) {
      // if (file_exists(ACTIONS.'_after'.EXT)) {
        // include ACTIONS.'_after'.EXT;
      // }
    // }

    // SFResponse::render();
  // }


?>
