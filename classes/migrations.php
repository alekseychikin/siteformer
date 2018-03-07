<?php

class SFMigrations
{
  private static $lastMigration = 0;
  private static $pathMigrations;
  private static $addConstructions = [];

  public static function init($params) {
    if (isset($params['migration-path']) && strlen($params['migration-path'])) {
      self::$pathMigrations = pathresolve($params['migration-path']);

      if (!file_exists(self::$pathMigrations)) {
        die('Не найдена папка с миграциями: ' . self::$pathMigrations);
      }

      self::preserveLastMigration();

      self::doMigrations();
    }
  }

  public static function add($callback) {
    self::$addConstructions[] = $callback;
  }

  private static function doMigrations() {
    $dir = opendir(self::$pathMigrations);
    $lastMigration = 0;
    $files = [];

    while ($file = readdir($dir)) {
      $filePath = pathresolve(self::$pathMigrations, $file);

      if ($file !== '.' && $file !== '..' && is_file($filePath) && extname($file) === '.php') {
        $index = (int) $file;

        $files[$index] = $file;
      }
    }

    ksort($files);

    foreach ($files as $index => $file) {
      $filePath = pathresolve(self::$pathMigrations, $file);

      if (self::$lastMigration < $index) {
        require_once $filePath;
      }

      $lastMigration = $index;
    }

    $file = fopen(ENGINE . 'configs/migrations', 'w');
    fputs($file, $lastMigration);
    fclose($file);

    foreach (self::$addConstructions as $addConstruction) {
      $addConstruction();
    }
  }

  private static function preserveLastMigration() {
    if (file_exists(ENGINE . 'configs/migrations')) {
      $lastMigration = trim(file_get_contents(ENGINE . 'configs/migrations'));

      settype($lastMigration, 'integer');

      self::$lastMigration = $lastMigration;
    }
  }
}
