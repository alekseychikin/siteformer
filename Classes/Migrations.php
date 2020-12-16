<?php

namespace Engine\Classes;

use Engine\Modules\ORM\ORM;

class Migrations {
	private static $migrationLockPath;
	private static $migrations = [];
	private static $pathMigrations;

	public static function setMigrationsPath($path) {
		self::$pathMigrations = pathresolve($path);

		if (!file_exists(self::$pathMigrations)) {
			die('Не найдена папка с миграциями: ' . self::$pathMigrations);
		}

		self::$migrationLockPath = pathresolve(sys_get_temp_dir(), md5(__DIR__) . '.lock');
		self::migration();
	}

	public static function removeLock() {
		if (file_exists(self::$migrationLockPath)) {
			unlink(self::$migrationLockPath);
		}
	}

	private static function migration() {
		self::preserveLastMigration();

		if (file_exists(self::$migrationLockPath)) {
			return false;
		}

		$dir = opendir(self::$pathMigrations);
		$files = [];

		while ($file = readdir($dir)) {
			$filePath = pathresolve(self::$pathMigrations, $file);

			if ($file !== '.' && $file !== '..' && is_file($filePath) && extname($file) === '.php') {
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
			$lockFile = fopen(self::$migrationLockPath, 'w');
			fclose($lockFile);

			foreach ($files as $index => $file) {
				if (array_search($file, self::$migrations) === false) {
					$filePath = pathresolve(self::$pathMigrations, $file);
					self::$migrations[] = $file;

					require_once $filePath;

					ORM::insert('sys_migrations')
					->values(['filepath' => $file])
					->exec();
				}
			}

			self::removeLock();
		}
	}

	private static function preserveLastMigration() {
		if (!ORM::exists('sys_migrations')) {
			ORM::create('sys_migrations')
			->addField([
				'name' => 'id',
				'type' => 'INT(11) UNSIGNED',
				'autoincrement' => true
			])
			->addField([
				'name' => 'filepath',
				'type' => 'VARCHAR(200)'
			])
			->addKey('id', 'PRIMARY KEY')
			->addKey('filepath', 'KEY')
			->exec();
		}

		$data = ORM::query('SELECT * FROM `sys_migrations` ORDER BY `filepath` ASC');

		foreach ($data as $row) {
			self::$migrations[] = $row['filepath'];
		}
	}
}
