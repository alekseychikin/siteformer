<?php

class ClearCache {
  public static function clear($path = ENGINE_TEMP) {
    if (file_exists($path)) {
      $dir = opendir($path);

      $hasFiles = false;

      while ($file = readdir($dir)) {
        if ($file !== '.' && $file !== '..') {
          if (is_dir($path . $file)) {
            if (self::clear($path . $file . '/')) {
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
      }
    }
  }
}
