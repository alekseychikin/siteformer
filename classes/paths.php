<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  define('PPD_OPEN_LEFT', 1 << 0); // 0001
  define('PPD_CLOSE_LEFT', 1 << 1); // 0010
  define('PPD_OPEN_RIGHT', 1 << 2); // 0100
  define('PPD_CLOSE_RIGHT', 1 << 3); // 1000
  define('PPD_DEFAULT', PPD_CLOSE_LEFT | PPD_CLOSE_RIGHT); // 1000

  class SFPath
  {
    private static $s3 = false;
    private static $awsAccessKey;
    private static $awsSecretKey;
    private static $bucket;

    public static function prepareDir($path, $conf = PPD_DEFAULT)
    {
      if (substr($path, 0, 1) === '/' && ($conf & PPD_OPEN_LEFT)) {
        $path = substr($path, 1);
      }
      if (substr($path, 0, 1) !== '/' && ($conf & PPD_CLOSE_LEFT)) {
        $path = '/' . $path;
      }
      if (substr($path, -1) === '/' && ($conf & PPD_OPEN_RIGHT)) {
        $path = substr($path, 0, -1);
      }
      if (substr($path, -1) !== '/' && ($conf & PPD_CLOSE_RIGHT)) {
        $path .= '/';
      }
      return $path;
    }

    public static function mkdir($path)
    {
      if (strpos($path, ROOT) === 0) {
        $path = substr($path, strlen(ROOT));
      }
      $elements = explode('/', $path);
      foreach ($elements as $key => $val) {
        if (empty($val)) {
          unset($elements[$key]);
        }
      }
      $path = '';
      foreach ($elements as $file) {
        $path .= $file.'/';
        if (!file_exists(ROOT.$path)) {
          mkdir(ROOT.$path, 0777);
        }
      }

    }

    public static function getExt($path)
    {
      return strtolower(substr(strrchr($path, '.'), 1));
    }

    public static function connectS3($awsAccessKey, $awsSecretKey, $bucket)
    {
      S3::$useSSL = false;
      self::$awsSecretKey = $awsSecretKey;
      self::$awsSecretKey = $awsSecretKey;
      self::$bucket = $bucket;
    }

    public static function moveToBuckete($path = '', $filename_)
    {
      if (!self::$s3) {
        self::$s3 = new S3(self::$awsAccessKey, self::$awsSecretKey);
      }
      $filename = baseName($filename_);
      $ext = strtolower(substr(strrchr($filename, '.'), 1));
      $filename = substr($filename, 0, strlen($filename) - strlen($ext) - 1);
      $fn = $filename . '.' . $ext;
      $i = 1;
      while (self::$s3->getObjectInfo(self::$bucket, $path . $fn)) {
        $fn = $filename . '-' . ++$i . '.' . $ext;
      }
      self::$s3->putObjectFile($filename_, self::$bucket, $path . $fn, S3::ACL_PUBLIC_READ);
      unlink($filename_);
      return $path . $fn;
    }

  }

?>
