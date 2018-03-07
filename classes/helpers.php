<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

function println() {
  $variables = func_get_args();

  foreach ($variables as $variable) {
    if (gettype($variable) === 'array') {
      echo '<pre>' . print_r($variable, true) . '</pre>';
    } else {
      echo $variable;
    }

    echo '   ';
  }

  echo "\n";
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

function arrDifference($source, $dest) {
  $res = [];
  $indexA = 0; // for source
  $indexB = 0; // for dest
  $buffer = [
    'indexesA' => [],
    'indexesB' => []
  ];

  if (!count($source)) {
    for (; $indexB < count($dest); $indexB++) {
      $buffer['indexesB'][] = $indexB;
    }
  } else {
    while ($indexA < count($source)) {
      if ($indexB < count($dest)) {
        if (isEqual($source[$indexA], $dest[$indexB])) {
          putBufferElementsInRes($res, $buffer, $source, $dest);

          putElementInRes($res, $dest[$indexB], 'skip', $source[$indexA]);
        } else {
          $findedIndexB = findSourceIndexInBuffer($buffer['indexesB'], $dest, $source[$indexA]);
          $findedIndexA = findSourceIndexInBuffer($buffer['indexesA'], $source, $dest[$indexB]);

          if ($findedIndexB !== false) {
            $indexB = $buffer['indexesB'][$findedIndexB];

            array_splice($buffer['indexesB'], $findedIndexB);

            putBufferElementsInRes($res, $buffer, $source, $dest);

            putElementInRes($res, $dest[$indexB], 'skip', $source[$indexA]);
          } else if ($findedIndexA !== false) {
            $indexA = $buffer['indexesA'][$findedIndexA];

            array_splice($buffer['indexesA'], $findedIndexA, count($buffer['indexesA']));

            putBufferElementsInRes($res, $buffer, $source, $dest);

            putElementInRes($res, $dest[$indexB], 'skip', $source[$indexA]);
          } else {
            $buffer['indexesA'][] = $indexA;
            $buffer['indexesB'][] = $indexB;
          }
        }

        $indexA++;
        $indexB++;
      }

      if ($indexA >= count($source) || $indexB >= count($dest)) {
        for (; $indexA < count($source); $indexA++) {
          $findedIndexB = findSourceIndexInBuffer($buffer['indexesB'], $dest, $source[$indexA]);

          if ($findedIndexB !== false) {
            $indexB = $buffer['indexesB'][$findedIndexB];

            array_splice($buffer['indexesB'], $findedIndexB, count($buffer['indexesB']));

            putBufferElementsInRes($res, $buffer, $source, $dest);

            putElementInRes($res, $dest[$indexB], 'skip', $source[$indexA]);
            $indexA++;
            $indexB++;

            break;
          } else {
            $buffer['indexesA'][] = $indexA;
          }
        }

        for (; $indexB < count($dest); $indexB++) {
          $findedIndexA = findSourceIndexInBuffer($buffer['indexesA'], $source, $dest[$indexB]);

          if ($findedIndexA !== false) {
            $indexA = $buffer['indexesA'][$findedIndexA];

            array_splice($buffer['indexesA'], $findedIndexA, count($buffer['indexesA']));

            putBufferElementsInRes($res, $buffer, $source, $dest);

            putElementInRes($res, $dest[$indexB], 'skip', $source[$indexA]);
            $indexA++;
            $indexB++;

            break;
          } else {
            $buffer['indexesB'][] = $indexB;
          }
        }
      }
    }
  }

  putBufferElementsInRes($res, $buffer, $source, $dest);

  return $res;
}

function putElementInRes(& $res, $element, $mark, $origin = false) {
  $element = array(
    'mark' => $mark,
    'element' => $element
  );

  if ($origin !== false) {
    $element['origin'] = $origin;
  }

  $res[] = $element;
}

function putBufferElementsInRes(& $res, & $buffer, $source, $dest) {
  for ($i = 0, $len = min(count($buffer['indexesA']), count($buffer['indexesB'])); $i < $len; $i++) {
    putElementInRes($res, $dest[$buffer['indexesB'][$i]], 'edit', $source[$buffer['indexesA'][$i]]);
  }

  if (count($buffer['indexesA']) > count($buffer['indexesB'])) {
    for ($j = $i; $j < count($buffer['indexesA']); $j++) {
      putElementInRes($res, $source[$buffer['indexesA'][$j]], 'delete');
    }
  } else {
    for ($j = $i; $j < count($buffer['indexesB']); $j++) {
      putElementInRes($res, $dest[$buffer['indexesB'][$j]], 'add');
    }
  }

  array_splice($buffer['indexesA'], 0, count($buffer['indexesA']));
  array_splice($buffer['indexesB'], 0, count($buffer['indexesB']));
}

function isEqual($sourceA, $sourceB) {
  if (gettype($sourceA) !== gettype($sourceB)) return false;

  if (gettype($sourceA) !== 'array' && gettype($sourceB) !== 'array') return $sourceA !== $sourceB;

  // each fields of source array and check them at dest array
  // if it not exists or not equals then return false
  foreach ($sourceA as $key => $value) {
    if (!isset($sourceB[$key])) return false;
    elseif ($value !== $sourceB[$key]) return false;
  }
  // do the same thing with dest array
  // if dest field not exists in source array
  // or not empty then return false
  foreach ($sourceB as $key => $value) {
    if (!isset($sourceA[$key])) return false;
    elseif ($value !== $sourceA[$key]) return false;
  }
  // if everything fine return true
  // arrays are equals
  return true;
}

function findSourceIndexInBuffer($indexes, $elements, $srcElement) {
  for ($i = 0; $i < count($indexes); $i++) {
    if (isEqual($elements[$indexes[$i]], $srcElement)) {
      return $i;
    }
  }

  return false;
}

function pathresolve() {
  $dirs = func_get_args();
  $path = '';

  foreach ($dirs as $index => $dir) {
    if (!strlen($dir)) continue;
    if (strlen($dir) > 1 && $dir[strlen($dir) - 1] === DIRECTORY_SEPARATOR) {
      $dir = substr($dir, 0, -1);
    }

    if ($dir[0] === DIRECTORY_SEPARATOR) {
      $path = $dir;
    } else {
      $path .= ($index ? DIRECTORY_SEPARATOR : '') . $dir;
    }
  }

  if (strlen($path) && $path[0] !== DIRECTORY_SEPARATOR) {
    $error = new Exception();
    $trace = $error->getTrace();
    $path = dirname($trace[0]['file']) . DIRECTORY_SEPARATOR . $path;
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
