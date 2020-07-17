<?php

use Engine\Classes\Response;
use Engine\Classes\Diagnostics;
use Engine\Classes\ClearCache;
use Engine\Classes\Exceptions\ValidateException;
use Engine\Classes\Exceptions\BaseException;
use Engine\Classes\Exceptions\PageNotFoundException;
use Engine\Modules\Router\Router;

return function ($entryPoint) {
	$startTime = explode(' ', microtime());
	$startTime = $startTime[1] + $startTime[0];

	session_start();
	header('Content-type: text/html; charset=utf8');
	define('EOL', "\n");

	ClearCache::clear();

	try {
		$entryPoint();
	} catch (ValidateException $e) {
		$message = $e->getDetails();

		Response::error(422, $message);
	} catch (BaseException $e) {
		Response::error(400, $e->message());
	} catch (\Exception $e) {
		Response::error(400, $e->getMessage());
	}

	try {
		Router::route();

		Response::render();
	} catch (PageNotFoundException $e) {
		Router::handleError(404);
	} catch (ValidateException $e) {
		$message = $e->getDetails();

		Response::error(422, $message);
	} catch (BaseException $e) {
		Response::error(400, $e->message());
	} catch (Exception $e) {
		Response::error(400, $e->getMessage());
	}
};
