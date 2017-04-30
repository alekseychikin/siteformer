<?

	class SFTypeImage extends SFGUIType
	{

		/**
		 * @param $value
		 *
		 * @return array
		 */
		public function set($value)
		{
			$path = $this->params['path'];
			$exts = $this->params['exts'];
			$filenamePattern = $this->params['filename_pattern'];
			$fn = false;
			$error = false;
			$outfilename = '';
			if (file_exists(TEMP.$value)) {
				$basename = basename($value);
				$ext = strtolower(substr(strrchr($basename, '.'), 1));
				if (in_array($ext, $exts)) {
					$filename = SFText::getTag($basename);
					$fn       = $filename;
					$filename = str_replace(array('%Y', '%m', '%d', '%h', '%i', '%s', '%p'),
						array(date('Y'), date('m'), date('d'), date('h'), date('i'), date('s'), $fn), $filenamePattern);
					$filename = substr($filename, 0, strlen($filename) - strlen($ext));
					$fn       = $filename.'.'.$ext;
					SFPath::mkdir(dirname(ROOT.$path.$fn));
					$outfilename = ROOT.$path.$fn;
					$i           = 2;
					while (file_exists($outfilename)) {
						$fn          = $filename.'-'.$i.'.'.$ext;
						$outfilename = ROOT.$path.$fn;
						$i++;
					}
					if (copy(TEMP.$value, $outfilename)) {
						$this->value = $fn;
						if (gettype($this->object) == 'object') {
							$this->object->set($this->field, $fn);
						}
					}
					else {
						$fn = false;
						$error = 'Ошибка перемещения файла из временного хранилища в папку-приёмник. Возможно недостаточно прав на запись в папке '.ROOT.$path;
					}
				}
				else {
					$error = 'Неправильный тип данных';
				}
			}
			else if (isset($_FILES[$value])) {
				$files = $_FILES[$value];
				if (is_uploaded_file($files['tmp_name'])) {
					$ext = strtolower(substr(strrchr($files['name'], '.'), 1));
					if (in_array($ext, $exts)) {
						$filename = SFText::getTag($files['name']);
						$fn       = $filename;
						$filename = str_replace(array('%Y', '%m', '%d', '%h', '%i', '%s', '%p'),
							array(date('Y'), date('m'), date('d'), date('h'), date('i'), date('s'), $fn), $filenamePattern);
						$filename = substr($filename, 0, strlen($filename) - strlen($ext));
						$fn       = $filename.'.'.$ext;
						SFPath::mkdir(dirname(ROOT.$path.$fn));
						$outfilename = ROOT.$path.$fn;
						$i           = 2;
						while (file_exists($outfilename)) {
							$fn          = $filename.'-'.$i.'.'.$ext;
							$outfilename = ROOT.$path.$fn;
							$i++;
						}
						if (move_uploaded_file($files['tmp_name'], $outfilename)) {
							$this->value = $fn;
							if (gettype($this->object) == 'object') {
								$this->object->set($this->field, $fn);
							}
						}
						else {
							$fn = false;
							$error = 'Ошибка перемещения файла из временного хранилища в папку-приёмник. Возможно недостаточно прав на запись в папке '.ROOT.$path;
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
			if (!$error) {
				if (isset($this->params['actions'])) {
					$actions = explode(' ', $this->params['actions']);
					for ($i = 0; $i < count($actions); $i++) {
						if (isset($this->params[$actions[$i]])) {
							$params = $this->params[$actions[$i]];
							if (isset($params['type'])) {
								switch ($params['type']) {
									case 'crop':
										$this->crop($outfilename, $params);
										break;
									case 'resize':
										$this->resize($outfilename, $params);
										break;
								}
							}
						}
					}
				}
			}
			return array($error, $fn);
		}

		public function setParams($params)
		{
			$this->params = $params;
		}

		public function crop($filename, $params)
		{
			$width = $this->getSize($filename, 'width');
			$height = $this->getSize($filename, 'height');
			$image  = $this->createImage($filename);
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
			$this->saveImage($canvas, $filename);
		}

		public function resize($filename, $params)
		{
			$width = $this->getSize($filename, 'width');
			$height = $this->getSize($filename, 'height');
			if (!isset($params['width'])) {
				$params['width'] = 0;
			}
			if (!isset($params['height'])) {
				$params['height'] = 0;
			}
			if ($params['width'] != 0 && $params['width'] < $width) {
				$height = (int)($height - (($width - $params['width']) / ($width / $height)));
				$width = $params['width'];
			}
			if ($params['height'] != 0 && $params['height'] < $height) {
				$width = (int)($width - (($height - $params['height']) / ($height / $width)));
				$height = $params['height'];
			}
			$image  = $this->createImage($filename);
			$canvas = $this->createCanvas($width, $height);
			$this->resizeImage($image, $canvas, $this->getSize($filename, 'width'), $this->getSize($filename, 'height'), $width, $height);
			$this->saveImage($canvas, $filename);

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

		private function saveImage($image, $path)
		{
			$ext = strtolower(substr(strrchr($this->value, '.'), 1));
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

		public function get()
		{
			return ($this->value != '--removed--' ? $this->params['path'].$this->value : '--removed--');
		}

		public function remove()
		{
			$this->set('--removed--');
//			echo 'remove';
//			die();
		}
	}
