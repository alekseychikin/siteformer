<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/base-exception.php';
require_once __DIR__ . '/validate.php';

class SFStorages {
  private static $storages;
  private static $s3Connections = [];

  public static function init($configs) {
    try {
      self::$storages = arrMap($configs, function ($configs, $storage) {
        switch ($configs['type']) {
          case 'local':
            return self::validateLocal($configs, $storage);
          case 's3':
            return self::validateS3($configs, $storage);
          default:
            throw new ValidateException([
              'code' => 'EWRONGSTORAGETYPE',
              'index' => [],
              'source' => $configs['type']
            ]);
        }
      });
    } catch (ValidateException $e) {
      $message = $e->getOriginMessage();
      array_unshift($message['index'], 'storages');
      throw new ValidateException($message);
    }
  }

  public static function getStorageList() {
    return array_keys(self::$storages);
  }

  public static function put($storage, $path, $additionalPath = '') {
    if (!isset(self::$storages[$storage])) {
      throw new BaseException('No such storage (' . $storage . ') in configs');
    }

    switch (self::$storages[$storage]['type']) {
      case 'local':
        return self::putLocal(self::$storages[$storage], $path, $additionalPath);
      case 's3':
        return self::putS3(self::$storages[$storage], $path, $additionalPath);
    }
  }

  public static function uploadToTemp($fieldname) {
    if (isset($_FILES[$fieldname])) {
      $files = $_FILES[$fieldname];
      $outfilenames = [];
      $isSingleSource = gettype($files['tmp_name']) !== 'array';

      if ($isSingleSource) {
        $files['tmp_name'] = [$files['tmp_name']];
        $files['name'] = [$files['name']];
      }

      foreach ($files['tmp_name'] as $index => $tmpname) {
        $outfilename = pathresolve(ENGINE_TEMP, md5(time() . rand())) . extname($files['name'][$index]);

        if (@is_uploaded_file($tmpname)) {
          if (@move_uploaded_file($tmpname, $outfilename)) {
            $outfilenames[] = $outfilename;
          } else {
            throw new BaseException('Ошибка перемещения файла из временного хранилища в папку-приёмник. Возможно недостаточно прав на запись в папке ' . $path);
          }
        } else {
          throw new BaseException('Ошибка загрузки файла');
        }
      }

      return $isSingleSource ? $outfilenames[0] : $outfilenames;
    } else {
      throw new BaseException('Файл не передан для загрузки');
    }
  }

  public static function delete($storage, $path) {
    if (!isset(self::$storages[$storage])) {
      throw new BaseException('No such storage (' . $storage . ') in configs');
    }

    switch (self::$storages[$storage]['type']) {
      case 'local':
        return self::deleteLocal(self::$storages[$storage], $path);
      case 's3':
        return self::deleteS3(self::$storages[$storage], $path);
    }
  }

  private static function validateLocal($configs, $storage) {
    return SFValidate::value([
      'type' => [],
      'path' => [
        'required' => true
      ]
    ], $configs, [$storage]);
  }

  private static function validateS3($configs, $storage) {
    return SFValidate::value([
      'type' => [],
      'accessKey' => [
        'required' => true
      ],
      'secretKey' => [
        'required' => true
      ],
      'bucket' => [
        'required' => true
      ],
      'path' => [],
      'location' => [
        'required' => true
      ]
    ], $configs, [$storage]);
  }

  private static function putLocal($configs, $path, $additionalPath = '') {
    $ext = extname($path);
    $basename = basename($path, $ext);
    $dirname = dirname($path);

    $filename = $basename . $ext;
    $i = 1;

    while (file_exists(pathresolve($configs['path'], $additionalPath, $filename))) {
      $filename = $basename . '-' . ++$i . $ext;
    }

    $outpath = dirname(pathresolve($configs['path'], $additionalPath, date('Y/m'), $filename));
    mkdirRecoursive($outpath);

    $outfilename = pathresolve($outpath, $filename);

    copy($path, $outfilename);

    return substr($outfilename, strlen(pathresolve($configs['path'])) + 1);
  }

  private static function getS3Connection($configs) {
    if (isset(self::$s3Connections[$configs['accessKey']])) {
      return self::$s3Connections[$configs['accessKey']];
    }

    S3::$useSSL = false;
    self::$s3Connections[$configs['accessKey']] = new S3($configs['accessKey'], $configs['secretKey']);
    return self::$s3Connections[$configs['accessKey']];
  }

  private static function putS3($configs, $path, $additionalPath = '') {
    $s3 = self::getS3Connection($configs);

    $ext = extname($path);
    $basename = basename($path, $ext);
    $dirname = dirname($path);

    $filename = $basename . $ext;
    $i = 1;
    $dirroot = pathresolve(__DIR__, $configs['path']);

    $outpath = substr(pathresolve($configs['path'], $additionalPath, date('Y/m'), $filename), strlen(__DIR__) + 1);

    while ($s3->getObjectInfo($configs['bucket'], $outpath)) {
      $filename = $basename . '-' . ++$i . $ext;
      $outpath = substr(pathresolve($configs['path'], $additionalPath, date('Y/m'), $filename), strlen(__DIR__) + 1);
    }

    $s3->putObjectFile($path, $configs['bucket'], $outpath, S3::ACL_PUBLIC_READ);

    return substr(pathresolve($configs['path'], $additionalPath, date('Y/m'), $filename), strlen($dirroot) + 1);
  }

  private static function deleteLocal($configs, $path) {
    $outpath = pathresolve($configs['path'], $path);

    if (file_exists($outpath)) {
      unlink($outpath);
    }
  }

  private static function deleteS3($configs, $path) {
    $s3 = self::getS3Connection($configs);

    $s3->deleteObject($configs['bucket'], $configs['path'] . '/' . $path);
  }
}
