<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFImage
  {
    private static $exts = array('jpg', 'jpeg', 'png');
    private $filename;

    public function path($pattern = '')
    {
      if (!empty($pattern)) {
        switch ($pattern) {
          case 'filename':
            return basename($this->filename);
          case 'filepath':
            return dirname($this->filename).'/';
        }
      }
      return $this->filename;
    }

    public function __construct($filename)
    {
      $this->filename = $filename;
    }

    public static function upload($filename, $path, & $error = false)
    {
      if (isset($_FILES[$filename])) {
        $files = $_FILES[$filename];
        if (is_uploaded_file($files['tmp_name'])) {
          $ext = strtolower(substr(strrchr($files['name'], '.'), 1));
          if (in_array($ext, self::$exts)) {
            $filename = SFText::getTag($files['name']);
            $fn       = $filename;
            $filename = substr($filename, 0, strlen($filename) - strlen($ext));
            $fn       = $filename.'.'.$ext;
            $outfilename = $path.$fn;
            SFPath::mkdir(dirname($outfilename));
            $i        = 2;
            while (file_exists($outfilename)) {
              $fn          = $filename.'-'.$i.'.'.$ext;
              $outfilename = $path.$fn;
              $i++;
            }
            if (move_uploaded_file($files['tmp_name'], $outfilename)) {
              return new SFImage($outfilename);
            }
            else {
              $error = 'Ошибка перемещения файла из временного хранилища в папку-приёмник. Возможно недостаточно прав на запись в папке '.$path;
            }
          }
          else {
            $error = 'Неправильный тип данных';
          }
        }
        else {
          $error = 'Ошибка загрузки файла';
        }
      }
      else {
        $error =  'Файл не передан для загрузки';
      }
      return false;
    }

    public function crop($params, $extFileName = '')
    {
      $width = $this->getSize($this->filename, 'width');
      $height = $this->getSize($this->filename, 'height');
      $image  = $this->createImage($this->filename);
      $canvas = $this->createCanvas($params['width'], $params['height']);
      $positionLeft = 'left';
      $positionTop = 'top';
      $position = explode(' ', $params['position']);
      $top = 0;
      $left = 0;
      for ($i = 0; $i < count($position); $i++) {
        switch ($position[$i]) {
        case 'left':
        case 'center':
        case 'right':
          $positionLeft = $position[$i];
          break;
        case 'top':
        case 'middle':
        case 'bottom':
          $positionTop = $position[$i];
          break;
        }
      }
      switch ($positionLeft) {
      case 'center':
        $left = (int) ($width / 2 - ($params['width'] / 2));
        break;
      case 'right':
        $left = (int) ($width - $params['width']);
        break;
      }
      switch ($positionTop) {
      case 'middle':
        $top = (int) ($height / 2 - ($params['height'] / 2));
        break;
      case 'bottom':
        $top = (int) ($height - $params['height']);
        break;
      }
      $this->cropImage($image, $canvas, $left, $top, $params['width'], $params['height']);
      if (!empty($extFileName)) {
        $this->saveImage($canvas, $extFileName);
        return new SFImage($extFileName);
      }
      else {
        $this->saveImage($canvas, $this->filename);
      }
      return $this;
    }

    public function resize($params, $extFileName = '')
    {
      $width = $this->getSize($this->filename, 'width');
      $height = $this->getSize($this->filename, 'height');
      if (!isset($params['width'])) {
        $params['width'] = 0;
      }
      if (!isset($params['height'])) {
        $params['height'] = 0;
      }
      if (isset($params['maxsize'])) {
        if ($width > $height) {
          $params['width'] = $params['maxsize'];
        }
        else {
          $params['height'] = $params['maxsize'];
        }
      }
      if (isset($params['minsize'])) {
        if ($width < $height) {
          $params['width'] = $params['minsize'];
        }
        else {
          $params['height'] = $params['minsize'];
        }
      }
      if ($params['width'] != 0 && $params['width'] < $width) {
        $height = (int)($height - (($width - $params['width']) / ($width / $height)));
        $width = $params['width'];
      }
      if ($params['height'] != 0 && $params['height'] < $height) {
        $width = (int)($width - (($height - $params['height']) / ($height / $width)));
        $height = $params['height'];
      }
      if ($params['width'] != 0 && $params['height'] != 0) {
        $width = $params['width'];
        $height = $params['height'];
      }
      $image  = $this->createImage($this->filename);
      $canvas = $this->createCanvas($width, $height);
      $this->resizeImage($image, $canvas, $this->getSize($this->filename, 'width'), $this->getSize($this->filename, 'height'), $width, $height);
      if (!empty($extFileName)) {
        $this->saveImage($canvas, $extFileName);
        return new SFImage($extFileName);
      }
      else {
        $this->saveImage($canvas, $this->filename);
      }
      return $this;
    }

    private function resizeImage(& $image, & $canvas, $width_from, $height_from, $width_to, $height_to)
    {
      imagecopyresampled($canvas, $image, 0, 0, 0, 0, $width_to, $height_to, $width_from, $height_from);
    }

    private function cropImage(& $image, & $canvas, $left_to, $top_to, $width_to, $height_to)
    {
      imagecopyresampled($canvas, $image, 0, 0, $left_to, $top_to, $width_to, $height_to, $width_to, $height_to);
    }

    private function getSize($filename, $item = '')
    {
      if (file_exists($filename)) {
        $size = getimagesize($filename);
        if (empty($item)) {
          return $size;
        }
        elseif ($item == 'width') {
          return $size[0];
        }
        elseif ($item == 'height') {
          return $size[1];
        }
      }
      return false;
    }

    private function createImage($filename)
    {
      $ext = strtolower(substr(strrchr($filename, '.'), 1));
      $image = false;
      switch ($ext) {
        case 'jpg':
        {
          $image = imagecreatefromjpeg($filename);
          break;
        }
        case 'jpeg':
        {
          $image = imagecreatefromjpeg($filename);
          break;
        }
        case 'png':
        {
          $image = imagecreatefrompng($filename);
          break;
        }
      }
      return $image;
    }

    private function createCanvas($width, $height)
    {
      $image      = imagecreatetruecolor($width, $height);
      $background = imagecolorallocate($image, 0, 0, 0);
      imagecolortransparent($image, $background);
      imagealphablending($image, false);
      imagesavealpha($image, true);
      return $image;
    }

    private function preparePath($path)
    {
      $basename = basename($this->filename);
      $path = str_replace(
                array('%filename%', '%filepath%', '%ext%', '%nameonly%'),
                array($basename, dirname($this->filename).'/', substr($basename, strrpos($basename, '.') + 1), substr($basename, 0, strrpos($basename, '.'))),
                $path
              );
      if (strpos($path, '.') === false) {
        $path .= substr($this->filename, strrpos($this->filename, '.'));
      }
      return $path;
    }

    private function saveImage($image, & $path)
    {
      $path = $this->preparePath($path);
      SFPath::mkdir(dirname($path));
      $ext = strtolower(substr(strrchr($path, '.'), 1));
      switch ($ext) {
        case 'jpg':
        {
          imagejpeg($image, $path, 85);
          break;
        }
        case 'jpeg':
        {
          imagejpeg($image, $path, 85);
          break;
        }
        case 'png':
        {
          imagepng($image, $path, 5);
          break;
        }
      }
    }

  }
