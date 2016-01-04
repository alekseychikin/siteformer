<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  if (isset($_FILES['image']) && isset($_FILES['image']['name'])) {
    for ($i = 0; $i < count ($_FILES['image']['name']); $i++) {
      $tmpPath = ENGINE . 'temp/types/image/';
      $filename = SFImage::upload('image', $tmpPath, $i);
      SFResponse::set('filename', substr($filename->path(), strlen(ENGINE) + 5));
    }
  }

  SFResponse::render();

?>
