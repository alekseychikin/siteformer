<?php

namespace Engine\Classes;

use Engine\Classes\Exceptions\ValidateException;
use Engine\Classes\Exceptions\BaseException;
use Engine\Modules\ORM\ORM;

class Diagnostics {
	public static function checkDatabaseConnection($configs) {
		try {
			$configs = Validate::value([
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

		try {
			$connection = ORM::init([
				'host' => $configs['host'],
				'user' => $configs['user'],
				'password' => $configs['password']
			]);
		} catch (BaseException $e) {
			throw new ValidateException(['code' => 'EDATABASECONNECTION', 'index' => ['database'], 'source' => $configs]);
		}

		try {
			ORM::setDatabase($configs['database']);
		} catch (BaseException $e) {
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

		return Validate::value([
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
