<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  function arrMap($arr, $cb)
  {
    foreach ($arr as $index => $value) {
      $arr[$index] = $cb($value, $index);
    }
    return $arr;
  }

  function arrReduce($arr, $cb, $default = 0)
  {
    $result = $default;
    foreach ($arr as $index => $value) {
      $result = $cb($result, $value, $index);
    }
    return $result;
  }

  function arrFilter($arr, $cb)
  {
    $result = array();
    foreach ($arr as $item) {
      if ($cb($item)) {
        $result[] = $item;
      }
    }
    return $result;
  }

  function arrSort($arr, $cb)
  {
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


?>
