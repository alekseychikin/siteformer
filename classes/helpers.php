<?php

function println() {
  $variables = func_get_args();

  $headers = SFResponse::getRequestHeaders();

  if (isset($headers['Accept'])) {
    $accept = strtolower($headers['Accept']);
  }

  if (!isset($headers['X-Requested-With']) || $headers['X-Requested-With'] !== 'XMLHttpRequest') {
    echo '<pre>';
  }

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

  if (isset($headers['X-Requested-With']) && $headers['X-Requested-With'] === 'XMLHttpRequest') {
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
  $result = array();

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
