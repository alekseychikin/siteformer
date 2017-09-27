<?php

function doEngine($configs) {
  $startTime = explode(' ', microtime());
  $startTime = $startTime[1] + $startTime[0];

  require_once __DIR__ . '/classes/diagnostics.php';

  Diagnostics::checkRequiredDirs();
  Diagnostics::checkTempConstExists();

  if (getenv('APPLICATION_ENV') !== false) {
    define('APPLICATION_ENV', getenv('APPLICATION_ENV'));
  } else {
    define('APPLICATION_ENV', 'production');
  }

  session_start();
  header('Content-type: text/html; charset=utf8');
  define('CLASSES', ENGINE . 'classes/');
  define('MODULES', ENGINE . 'modules/');
  define('N', "\n");

  require_once CLASSES . 'clear_cache.php';
  require_once CLASSES . 'validate-exception.php';
  require_once CLASSES . 'page_not_found_exception.php';

  if (isset($_SESSION['location'])) {
    $location = $_SESSION['location'];
    unset($_SESSION['location']);
    header('Location: ' . $location, true, 301);
    die;
  }

  require_once CLASSES . 'helpers.php';
  require_once CLASSES . 'log.php';
  require_once CLASSES . 'json.php';
  require_once CLASSES . 'S3.php';
  require_once CLASSES . 'models.php';
  require_once CLASSES . 'uri.php';
  require_once CLASSES . 'validate.php';
  require_once CLASSES . 'path.php';
  require_once CLASSES . 'text.php';
  require_once CLASSES . 'socket.php';
  require_once CLASSES . 'error.php';
  require_once CLASSES . 'image.php';
  require_once CLASSES . 'mail.php';
  require_once CLASSES . 'modules.php';
  require_once CLASSES . 'storages.php';

  ClearCache::clear();

  try {
    $configs = Diagnostics::checkConfigs($configs);

    require_once MODULES . 'Templater/Templater.php';

    SFTemplater::init([
      'path' => $configs['templates']
    ]);

    require_once MODULES . 'ORM/ORM.php';

    Diagnostics::checkDatabaseConnection($configs['database']);

    require_once MODULES . 'ERM/ERM.php';

    SFERM::init();

    SFStorages::init($configs['storages']);
    SFResponse::initRedirData();

    require_once MODULES . 'Router/Router.php';

    SFRouter::init([
      'routes' => $configs['routes'],
      'actions' => $configs['actions'],
      'languages' => $configs['languages'],
      'models' => $configs['models']
    ]);

    require_once MODULES . 'GUI/GUI.php';

    SFGUI::init();

    if (SFModules::main()) {
      SFResponse::render();
    }

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

    SFResponse::render();
  } catch (PageNotFoundException $e) {
    if (SFResponse::actionExists('404')) {
      SFResponse::run('404');
    } else {
      SFResponse::error(404, 'Page not found');
    }
  } catch (ValidateException $e) {
    $message = $e->getOriginMessage();

    if (in_array($message['index'][0], ['config_actions', 'config_routes', 'config_models', 'config_templates'])) {
      switch ($message['code']) {
        case 'EPATHISNOTEXISTS':
          die('Путь не найден: ' . $message['source']);
        case 'EPATHISNOTDIR':
          die('Это должна быть директория, а не файл: ' . $message['source']);
          break;
        case 'EPATHISNOTFILE':
          die('Это должен быть файл, а не директория: ' . $message['source']);
          break;
      }
    } elseif ($message['index'][0] === 'database') {
      switch ($message['code']) {
        case 'EDATABASECONNECTION':
          unset($message['source']['database']);
          die('Данные для подключения к mysql не подходят: ' . "\n" . print_r($message['source'], true));
        case 'EDATABASENAME':
          die('Подключение к mysql произошло, но база не найдена: ' . $message['source']['database']);
        case 'EEMPTYREQUIRED':
          die('Поле ' . $message['index'][1] . ' обязательно нужно заполнить');
      }
    } else {
      print_r($message);
    }
  } catch (BaseException $e) {
    SFResponse::error(400, $e->message());
  } catch (Exception $e) {
    SFResponse::error(400, $e->getMessage());
  }
}
