<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

	class SFAdmins
	{
		public static $user;
		private static $loginParams;

		public static function add($params)
		{
			$data = SFData('.configs/admins');
			$data->filter('login', $params['login']);
			if (!$data->length()) {
				$data->add($params);
				$data->save();
			}
			else {
				return 'User '.$params['login'].' is already exists';
			}
			return true;
		}

		public static function login($params)
		{
			self::$loginParams = $params;
			$data = SFData('.configs/admins');
			$auth = false;
			$issetFields = 0;
			foreach ($params as $field) {
				if (isset($_SESSION[$field])) {
					$data->filter($field, $_SESSION[$field]);
					$issetFields++;
				}
			}
			if ($issetFields == count($params)) {
				if ($data->length() == 1) {
					$auth = true;
				}
			}
			if (!$auth) {
				$data = SFData('.configs/admins');
				$issetFields = 0;
				foreach ($params as $field) {
					if (isset($_POST[$field])) {
						$data->filter($field, $_POST[$field]);
						$issetFields++;
					}
				}
				if ($issetFields == count($params)) {
					if ($data->length() == 1) {
						$auth = true;
						foreach ($params as $field) {
							$_SESSION[$field] = $data->get($field)->get();
						}
					}
				}
				if ($issetFields) {
					SFResponse::refresh();
				}
			}
			return $auth;
		}

		public static function logout()
		{
			foreach (self::$loginParams as $field) {
				unset($_SESSION[$field]);
			}
		}

		public static function edit($login)
		{
			$data = SFData('.configs/admins');
			$data->filter('login', $login);
			if (func_num_args() == 2) {
				$params = func_get_arg(1);
				list ($field, $value) = each($params);
				$result = $data->get($field)->set($value);
				return $result;
			}
			else if (func_num_args() == 3) {
				$field = func_get_arg(1);
				$value = func_get_arg(2);
				$result = $data->get($field)->set($value);
				$data->save();
				return $result;
			}
			return false;
		}

		public static function remove($login)
		{
			$data = SFData('.configs/admins');
			$data->filter('login', $login);
			if ($data->length()) {
				$data->remove(array('login' => $login));
				$data->save();
			}
		}
	}

?>
