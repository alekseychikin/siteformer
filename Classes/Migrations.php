<?php

namespace Engine\Classes;

class Migrations {
	private static $migrationFile = 'migrations.json';
	private static $migrationLock = 'migrations.lock';
	private static $migrations = [];
	private static $pathMigrations;

	public static function setMigrationsPath($path) {
		self::$pathMigrations = pathresolve($path);

		if (!file_exists(self::$pathMigrations)) {
			die('Не найдена папка с миграциями: ' . self::$pathMigrations);
		}

		self::migration();
	}

	private static function migration() {
		self::preserveLastMigration();

		if (file_exists(pathresolve(self::$pathMigrations, self::$migrationLock))) {
			return false;
		}

		$migrationFilePath = pathresolve(self::$pathMigrations, self::$migrationFile);
		$dir = opendir(self::$pathMigrations);
		$files = [];

		while ($file = readdir($dir)) {
			$filePath = pathresolve(self::$pathMigrations, $file);

			if ($file !== '.' && $file !== '..' && is_file($filePath) && $filePath !== self::$migrationFile && extname($file) === '.php') {
				$index = (int) $file;

				$files[$index] = $file;
			}
		}

		ksort($files);

		$hasChanges = false;

		foreach ($files as $index => $file) {
			if (array_search($file, self::$migrations) === false) {
				$hasChanges = true;
			}
		}

		if ($hasChanges) {
			$lockFile = fopen(pathresolve(self::$pathMigrations, self::$migrationLock), 'w');
			fclose($lockFile);

			foreach ($files as $index => $file) {
				if (array_search($file, self::$migrations) === false) {
					$filePath = pathresolve(self::$pathMigrations, $file);
					self::$migrations[] = $file;

					require_once $filePath;

					$file = fopen($migrationFilePath, 'w');
					fputs($file, json_encode([
							'executed' => self::$migrations
						], JSON_PRETTY_PRINT)
					);
					fclose($file);
				}
			}

			unlink(pathresolve(self::$pathMigrations, self::$migrationLock));
		}
	}

	private static function preserveLastMigration() {
		$migrationFilePath = pathresolve(self::$pathMigrations, self::$migrationFile);

		if (file_exists($migrationFilePath)) {
			try {
				$migrations = json_decode(file_get_contents($migrationFilePath), true);
				self::$migrations = $migrations['executed'];
			} catch (Exception $e) {
			}
		} else {
			try {
				$file = fopen($migrationFilePath, 'w');
				fputs(
					$file,
					json_encode([
						'executed' => []
					], JSON_PRETTY_PRINT)
				);
				fclose($file);
			} catch (Exception $e) {
				throw new \Exception('There is no write permission for lock file by path: ' . $migrationFilePath . '. Create it manually and give permission for write.');
			}
		}
	}
}
