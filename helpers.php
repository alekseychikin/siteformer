<?php

use Engine\Classes\Response;

function println() {
	$variables = func_get_args();
	$headers = Response::getRequestHeaders();
	$accept = '*/*';

	if (isset($headers['Accept'])) {
		$accept = strtolower($headers['Accept']);
	}

	$isAcceptJson = $accept === 'application/json';

	if (!$isAcceptJson) {
		echo '<pre>';

		foreach ($variables as $index => $variable) {
			if (gettype($variable) === 'array') {
				print_r($variable);
			} elseif (gettype($variable) === 'boolean') {
				echo $variable ? 'true' : 'false';
			} else {
				echo $variable;
			}

			if ($index < count($variables) - 1) {
				echo '   ';
			}
		}
	} else {
		if (count($variables) === 1) {
			echo json_encode($variables[0], JSON_UNESCAPED_UNICODE);
		} else {
			$output = [];

			foreach ($variables as $variable) {
				$output[] = json_encode($variable, JSON_UNESCAPED_UNICODE);
			}

			echo '[' . implode(', ', $output) . ']';
		}
	}

	if ($isAcceptJson) {
		echo EOL;
	} else {
		echo '</pre>' . EOL;
	}
}

function arrMap($arr, $cb) {
	foreach ($arr as $index => $value) {
		$arr[$index] = $cb($value, $index);
	}

	return $arr;
}

function arrReduce($arr, $cb, $default = 0) {
	$result = $default;

	foreach ($arr as $index => $value) {
		$result = $cb($result, $value, $index);
	}

	return $result;
}

function arrFilter($arr, $cb) {
	$result = [];

	foreach ($arr as $item) {
		if ($cb($item)) {
			$result[] = $item;
		}
	}

	return $result;
}

function arrSort($arr, $cb) {
	$prevIndex = false;
	$t = true;

	while ($t) {
		$t = false;

		foreach ($arr as $index => $item) {
			if ($prevIndex === false) {
				$prevIndex = $index;

				continue;
			}

			if ($cb($item, $arr[$prevIndex])) {
				$arr[$index] = $arr[$prevIndex];
				$arr[$prevIndex] = $item;
				$t = true;
				$prevIndex = false;

				break;
			}

			$prevIndex = $index;
		}
	}

	return $arr;
}

function arraySplice(& $source, $start = 0, $length = null, $insert = []) {
	$subArray = array_slice($source, $start, $length);

	$source = array_merge(
		array_slice($source, 0, $start),
		$insert,
		$length !== null ? array_slice($source, $start + $length) : []
	);

	return $subArray;
}

function pathresolve() {
	$dirs = func_get_args();
	$path = '';
	$isFirst = true;

	foreach ($dirs as $index => $dir) {
		if (!strlen($dir)) continue;
		if (strlen($dir) > 1 && $dir[strlen($dir) - 1] === DIRECTORY_SEPARATOR) {
			$dir = substr($dir, 0, -1);
		}

		if ($dir[0] === DIRECTORY_SEPARATOR) {
			$path = $dir;
		} else {
			$path .= (!$isFirst ? DIRECTORY_SEPARATOR : '') . $dir;
		}

		$isFirst = false;
	}

	return normalizeUrl($path, DIRECTORY_SEPARATOR);
}

function normalizeUrl($path, $separator = '/') {
	$dirs = explode($separator, $path);
	$path = [];

	foreach ($dirs as $dir) {
		switch ($dir) {
			case '.':
				break;
			case '..':
				array_pop($path);
				break;
			default:
				$path[] = $dir;
		}
	}

	return join($separator, $path);
}

/**
 * @param string $filename
 *
 * @return string extname of filename with prefix dot
 */
function extname($filename) {
	$ext = '';

	if (strpos($filename, '.') !== false) {
		$ext = strtolower(strrchr($filename, '.'));
	}

	return $ext;
}

function mkdirRecoursive($path) {
	$dirs = explode(DIRECTORY_SEPARATOR, $path);
	array_shift($dirs);

	$path = '';

	foreach ($dirs as $dir) {
		$path .= DIRECTORY_SEPARATOR . $dir;

		if (!file_exists($path)) {
			mkdir($path, 0777);
		}
	}
}

function parseJSON($str) {
	return prepareJSONResponse(json_decode($str, true));
}

function prepareJSONResponse($obj) {
	if (gettype($obj) === 'array') {
		foreach ($obj as $key => $value) {
			$obj[$key] = prepareJSONResponse($value);
		}
	} elseif (gettype($obj) === 'string') {
		if (preg_match('/^(true|false)$/', $obj)) {
			return $obj === 'true' ? true : false;
		}

		if (preg_match('/^\d+\.\d+$/', $obj)) {
			return (float)$obj;
		}

		if (preg_match('/^\d+$/', $obj)) {
			return (int)$obj;
		}
	}

	return $obj;
}
