<?php

function echoError($message) {
	if (APPLICATION_ENV === 'develop') {
		\Engine\Classes\Response::error(500, $message);
	} else {
		\Engine\Classes\Response::error(500, 'Произошла некоторая ошибка');
	}
}

return function($exception) {
	echoError([
		'message' => $exception->getMessage() . ' at ' . $exception->getFile() .
			':' . $exception->getLine(),
		'trace' => $exception->getTrace()
	]);
};
