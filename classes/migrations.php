<?php

class SFMigrations
{
  private static $lastMigration = null;
  private static $pathMigrations;
  private static $addConstructions = [];

  public static function setMigrationsPath($path) {
    self::$pathMigrations = pathresolve($path);

    if (!file_exists(self::$pathMigrations)) {
      die('Не найдена папка с миграциями: ' . self::$pathMigrations);
    }

    self::preserveLastMigration();

    if (isset($_GET['migration']) && !empty($_GET['migration']) && APPLICATION_ENV === 'develop') {
      self::doMigration($_GET['migration']);
    }

    if (isset($_GET['migrations'])) {
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

    $file = fopen(__DIR__ . '/../configs/migrations', 'w');
    fputs($file, $lastMigration);
    fclose($file);

    foreach (self::$addConstructions as $addConstruction) {
      $addConstruction();
    }
  }

  private static function doMigration($name) {
    $filePath = pathresolve(self::$pathMigrations, $name . '.php');

    if (file_exists($filePath)) {
      require_once $filePath;
    } else {
      die('Migration file ' . $filePath . ' does not exists');
    }
  }

  private static function preserveLastMigration() {
    if (file_exists(__DIR__ . '/../configs/migrations')) {
      $lastMigration = trim(file_get_contents(__DIR__ . '/../configs/migrations'));

      settype($lastMigration, 'integer');

      self::$lastMigration = $lastMigration;
    }
  }
}
