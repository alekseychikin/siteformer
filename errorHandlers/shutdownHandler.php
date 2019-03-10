<?php

return function() {
	$error = error_get_last();

	switch ($error['type']) {
		case E_ERROR:
		case E_CORE_ERROR:
		case E_COMPILE_ERROR:
		case E_USER_ERROR:
		case E_RECOVERABLE_ERROR:
		case E_CORE_WARNING:
		case E_COMPILE_WARNING:
		case E_PARSE:
			echoError($error['message'] . ' at ' . $error['file'] . ':' . $error['line']);
	}
};
