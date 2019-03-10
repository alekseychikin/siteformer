<?php

namespace Engine;

return function ($entryPoint) {
	$startTime = explode(' ', microtime());
	$startTime = $startTime[1] + $startTime[0];

	\Engine\Classes\Diagnostics::checkRequiredDirs();

	session_start();
	header('Content-type: text/html; charset=utf8');
	define('EOL', "\n");

	\Engine\Classes\ClearCache::clear();

	try {
		$entryPoint();
	} catch (ValidateException $e) {
		$message = $e->getDetails();

		\Engine\Classes\Response::error(422, $message);
	} catch (BaseException $e) {
		\Engine\Classes\Response::error(400, $e->message());
	} catch (Exception $e) {
		\Engine\Classes\Response::error(400, $e->getMessage());
	}

	try {
		\Engine\Modules\Router\Router::route();

		\Engine\Classes\Response::render();
	} catch (PageNotFoundException $e) {
		println('PageNotFoundException');
	} catch (ValidateException $e) {
		$message = $e->getDetails();

		\Engine\Classes\Response::error(422, $message);
	} catch (BaseException $e) {
		\Engine\Classes\Response::error(400, $e->message());
	} catch (Exception $e) {
		\Engine\Classes\Response::error(400, $e->getMessage());
	}
};
