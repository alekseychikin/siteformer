<?php

namespace Engine\Classes;

class Migrations {
	private static $migrations = [];
	private static $pathMigrations;

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

	private static function doMigrations() {
		$lockFile = pathresolve(self::$pathMigrations, 'migrations.lock');
		$dir = opendir(self::$pathMigrations);
		$files = [];

		while ($file = readdir($dir)) {
			$filePath = pathresolve(self::$pathMigrations, $file);

			if ($file !== '.' && $file !== '..' && is_file($filePath) && $filePath !== 'migrations.lock' && extname($file) === '.php') {
				$index = (int) $file;

				$files[$index] = $file;
			}
		}

		ksort($files);

		foreach ($files as $index => $file) {
			$filePath = pathresolve(self::$pathMigrations, $file);

			if (array_search($file, self::$migrations) === false) {
				self::$migrations[] = $file;

				require_once $filePath;

				$file = fopen($lockFile, 'w');
				fputs($file, json_encode([
						'executed' => self::$migrations
					], JSON_PRETTY_PRINT)
				);
				fclose($file);
			}
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
		$lockFile = pathresolve(self::$pathMigrations, 'migrations.lock');

		if (file_exists($lockFile)) {
			try {
				$migrations = json_decode(file_get_contents($lockFile), true);
				self::$migrations = $migrations['executed'];
			} catch (Exception $e) {
			}
		} else {
			try {
				$file = fopen($lockFile, 'w');
				fputs(
					$file,
					json_encode([
						'executed' => []
					], JSON_PRETTY_PRINT)
				);
				fclose($file);
			} catch (Exception $e) {
				throw new \Exception('There is no write permission for lock file by path: ' . $lockFile . '. Create it manually and give permission for write.');
			}
		}
	}
}
