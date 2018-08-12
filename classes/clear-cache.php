<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class ClearCache {
  public static function clear() {
    if (file_exists(ENGINE_TEMP)) {
      self::recursive(ENGINE_TEMP);
    }
  }

  private static function recursive($path) {
    $dir = opendir($path);

    $hasFiles = false;

    while ($file = readdir($dir)) {
      if ($file !== '.' && $file !== '..') {
        if (is_dir($path . $file)) {
          if (self::recursive($path . $file . '/')) {
            $hasFiles = true;
          }
        } else {
          $lastModifyTime = filemtime($path . $file);

          if (time() - $lastModifyTime > 300) {
            @unlink($path . $file);
          } else {
            $hasFiles = true;
          }
        }
      }
    }
    closedir($dir);

    if (!$hasFiles && $path !== ENGINE_TEMP) {
      @rmdir($path);

      return false;
    }

    return true;
  }
}
