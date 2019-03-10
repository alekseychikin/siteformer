<?php

return function($errno, $msg, $file, $line) {
	if (!(error_reporting() & $errno)) {
		throw new ErrorException($msg, 0, $errno, $file, $line);
	}
};
