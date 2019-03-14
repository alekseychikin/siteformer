<?php

namespace Engine\Classes;

class Image {
	public static function crop($filepath, $params) {
		$imageSize = self::getSize($filepath);
		$width = $imageSize['width'];
		$height = $imageSize['height'];

		$image  = self::createImage($filepath);
		$canvas = self::createCanvas($params['width'], $params['height']);
		$positionLeft = 'left';
		$positionTop = 'top';
		$position = $params['position'];

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

		self::cropImage($image, $canvas, $left, $top, $params['width'], $params['height']);

		self::saveImage($canvas, $filepath);

		return true;
	}

	public static function resize($filepath, $params) {
		$imageSize = self::getSize($filepath);
		$width = $imageSize['width'];
		$height = $imageSize['height'];

		if (!isset($params['width'])) {
			$params['width'] = 0;
		}

		if (!isset($params['height'])) {
			$params['height'] = 0;
		}

		if (!isset($params['saveRatio'])) {
			$params['saveRatio'] = true;
		}

		if ($params['saveRatio']) {
			if ($params['width'] != 0 && $params['width'] < $width) {
				$height = (int)($height - (($width - $params['width']) / ($width / $height)));
				$width = $params['width'];
			}

			if ($params['height'] != 0 && $params['height'] < $height) {
				$width = (int)($width - (($height - $params['height']) / ($height / $width)));
				$height = $params['height'];
			}
		} else {
			if ($params['width'] != 0 && $params['height'] != 0) {
				$width = $params['width'];
				$height = $params['height'];
			}
		}

		$image  = self::createImage($filepath);
		$canvas = self::createCanvas($width, $height);
		self::resizeImage($image, $canvas, $imageSize['width'], $imageSize['height'], $width, $height);

		self::saveImage($canvas, $filepath);

		return true;
	}

	private static function resizeImage(& $image, & $canvas, $width_from, $height_from, $width_to, $height_to) {
		imagecopyresampled($canvas, $image, 0, 0, 0, 0, $width_to, $height_to, $width_from, $height_from);
	}

	private static function cropImage(& $image, & $canvas, $left_to, $top_to, $width_to, $height_to) {
		imagecopyresampled($canvas, $image, 0, 0, $left_to, $top_to, $width_to, $height_to, $width_to, $height_to);
	}

	private static function getSize($filename) {
		if (file_exists($filename)) {
			$size = getimagesize($filename);

			return [
				'width' => $size[0],
				'height' => $size[1]
			];
		}

		return false;
	}

	private static function createImage($filename) {
		$imageinfo = @getimagesize($filename);

		switch ($imageinfo['mime']) {
			case 'image/jpeg':
				return imagecreatefromjpeg($filename);
			case 'image/png':
				return imagecreatefrompng($filename);
			default:
				throw new \Exception('This mime type does not supporting yet as image: ' . $imageinfo['mime']);
		}

		return false;
	}

	private static function createCanvas($width, $height) {
		$image = imagecreatetruecolor($width, $height);
		$background = imagecolorallocate($image, 0, 0, 0);

		imagecolortransparent($image, $background);
		imagealphablending($image, false);
		imagesavealpha($image, true);

		return $image;
	}

	private static function saveImage($image, $filepath) {
		$ext = strtolower(substr(strrchr($filepath, '.'), 1));

		switch ($ext) {
			case 'jpg':
			case 'jpeg':
				imagejpeg($image, $filepath, 85);

				break;
			case 'png':
				imagepng($image, $filepath, 5);

				break;
		}
	}
}
