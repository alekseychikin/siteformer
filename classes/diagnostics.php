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

  public static function checkDatabaseConnection($configs) {
    try {
      $configs = SFValidate::value([
        'host' => [
          'required' => true
        ],
        'user' => [
          'required' => true
        ],
        'password' => [],
        'database' => [
          'required' => true
        ]
      ], $configs);
    } catch (ValidateException $e) {
      $message = $e->getDetails();
      array_unshift($message['index'], 'database');
      throw new ValidateException(['code' => $message['code'], 'index' => $message['index'], 'source' => $message['source']]);
    }

    $connection = SFORM::init([
      'host' => $configs['host'],
      'user' => $configs['user'],
      'password' => $configs['password']
    ]);

    if (!$connection) {
      throw new ValidateException(['code' => 'EDATABASECONNECTION', 'index' => ['database'], 'source' => $configs]);
    }

    if (SFORM::database($configs['database']) === false) {
      throw new ValidateException(['code' => 'EDATABASENAME', 'index' => ['database', 'database'], 'source' => $configs]);
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
        'type' => 'array'
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
      ],
      'database' => [
        'required' => true,
        'type' => 'array'
      ],
      'storages' => [
        'default' => [],
        'type' => 'array'
      ],
      'modrewrite-get-url' => [
        'required' => true
      ],
      'migration-path' => [
      ]
    ], $configs);
  }
}
