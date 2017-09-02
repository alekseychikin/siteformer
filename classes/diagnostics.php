<?php

class Diagnostics {
  public static function checkRequiredDirs() {
    $requiredDirs = ['userpics', 'temp', 'configs'];

    foreach ($requiredDirs as $dir) {
      $path = __DIR__ . '/../' . $dir;

      if (!file_exists($path)) die('В директории движка должна быть создана директория ' . $dir . ' доступная на запись');

      if (!is_dir($path)) die($dir . ' — это должна быть директория, а не файл');

      if (!is_writable($path)) die('Директория ' . $dir . ' должна быть доступна на запись');
    }
  }

  public static function checkTempConstExists() {
    if (!defined('TEMP')) die('Константа `TEMP` должна быть задана и содержать путь до временных файлов проекта. ' . "<br />\n" . 'Например:' . "<br />\n" .' define(\'TEMP\', \'./temp/\');');

    if (!file_exists(TEMP)) die('Путь ' . TEMP . ' не найден');

    if (!is_dir(TEMP)) die(TEMP . ' должна быть директория, а не файл');

    if (!is_writable(TEMP)) die('Временная директория ' . TEMP . ' должна быть доступна на запись');
  }

  public static function checkDatabaseConnection() {
    if (isset($_POST['checkConnection'])) {
      $host = $_POST['host'];
      $user = $_POST['user'];
      $password = $_POST['password'];

      $connection = SFORM::init([
        'host' => $host,
        'user' => $user,
        'password' => $password
      ]);

      SFResponse::set('connection', $connection);
      SFResponse::set('databases', []);

      if ($connection) {
        SFResponse::set('databases', SFORM::getDatabases());
      }

      SFResponse::render();
    } elseif (isset($_POST['validateConfigs'])) {
      $host = $_POST['host'];
      $user = $_POST['user'];
      $password = $_POST['password'];
      $database = $_POST['database'];

      $connection = SFORM::init([
        'host' => $host,
        'user' => $user,
        'password' => $password
      ]);

      SFResponse::set('connection', $connection);

      // дописать переключение на базу данных, если сам подключение получилось удачно

      SFResponse::render();
    } else {
      if (!file_exists(__DIR__ . '/../configs/database.php')) {
        SFTemplater::setCompilesPath(ENGINE . 'modules/GUI/dist/');
        echo SFTemplater::render('sections/main/setup-database.tmplt', SFResponse::getState());
        SFResponse::render();
      }
    }
  }

  public static function checkConfigs($configs) {
    $validateFilePath = function ($index, $path) {
      if (!file_exists($path)) {
        throw new ValidateException(['code' => 'EPATHISNOTEXISTS', 'index' => [$index], 'source' => $path]);
      }

      if (!is_file($path)) {
        throw new ValidateException(['code' => 'EPATHISNOTFILE', 'index' => [$index], 'source' => $path]);
      }

      return true;
    };

    $validateDirPath = function ($index, $path) {
      if (!file_exists($path)) {
        throw new ValidateException(['code' => 'EPATHISNOTEXISTS', 'index' => [$index], 'source' => $path]);
      }

      if (!is_dir($path)) {
        throw new ValidateException(['code' => 'EPATHISNOTDIR', 'index' => [$index], 'source' => $path]);
      }

      return true;
    };

    return SFValidate::value([
      'actions' => [
        'valid' => function ($path) use ($validateDirPath) {
          return $validateDirPath('config_actions', $path);
        }
      ],
      'routes' => [
        'valid' => function ($path) use ($validateFilePath) {
          return $validateFilePath('config_routes', $path);
        }
      ],
      'models' => [
        'valid' => function ($path) use ($validateDirPath) {
          return $validateDirPath('config_models', $path);
        }
      ],
      'templates' => [
        'valid' => function ($path) use ($validateDirPath) {
          return $validateDirPath('config_templates', $path);
        }
      ],
      'languages' => [
        'type' => 'array',
        'default' => ['ru']
      ],
      'environment' => [
        'default' => 'default'
      ],
      'domains' => [
        'default' => false
      ]
    ], $configs);
  }
}
