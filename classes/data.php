<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

	class SFDataClass
	{
		private $item;
		private $data;
		private $row;
		private $key = false;
		private $params = array();
		private $path = false;
		private $paramsFileName;
		private $resource;

		public function __construct($item, $data = false)
		{
			$this->item = $item;

			if (file_exists(ENGINE.$item.EXT)) {
				if ($file = fopen(ENGINE.$item.EXT, 'r')) {
					while (!feof($file)) {
						$file_ = fgets($file);
						if (strpos($file_, '@config') !== false) {
							$this->paramsFileName = trim(substr($file_, strpos($file_, '@config') + 8));
							if (file_exists(DATAPTH.$this->paramsFileName)) {
								$this->params = include DATAPTH.$this->paramsFileName;
							}
							break;
						}
					}
					fclose($file);
					if ($data !== false) {
						$this->resource = $data;
						$this->data = $data;
					}
					else {
						$this->path = ENGINE.$item.EXT;
						$this->resource = include ENGINE.$item.EXT;
						$this->data = $this->resource;
					}
				}
			}
			else {
				new SFError('File not exists: '.$item.EXT);
			}

		}

		public function fetch()
		{
			if (list($key, $row) = each($this->data)) {
				$this->key = $key;
				foreach ($row as $field => $param) {
					if (isset($this->params[$field])) {
						$className = 'SFType'.strtoupper(substr($this->params[$field]['type'], 0, 1)).substr($this->params[$field]['type'], 1);
						$value = $row[$field];
						if (class_exists($className)) {
							$row[$field] = new ReflectionClass($className);
							$row[$field] = call_user_func(array($row[$field], 'newInstanceArgs'));
						}
						else {
							$row[$field] = new SFTypeDefault();
						}
						$row[$field]->setDefault($value);
						$row[$field]->setObject($this, $field);
						if (isset($this->params[$field]['params'])) {
							$row[$field]->setParams($this->params[$field]['params']);
						}
					}
				}
				$this->row = $row;
				return true;
			}
			else {
				$this->reset(false);
			}
			return false;
		}

		/**
		 * @param $item
		 *
		 * @return SFType
		 */
		public function get($item)
		{
			if (isset($this->row[$item])) {
				return $this->row[$item];
			}
			return false;
		}

		public function set($field, $value)
		{
			$this->data[$this->key][$field] = $value;
			$this->resource[$this->key][$field] = $value;
			return $this;
		}

		public function remove($key = false)
		{
			if ($key === false) {
				if ($this->key !== false) {
					unset($this->data[$this->key]);
				}
				else {
					$this->data = array();
				}
			}
			else if ((gettype($key) == 'string' || gettype($key) == 'integer') && isset($this->data[$key])) {
				unset($this->data[$key]);
				unset($this->resource[$key]);
			}
			else if (gettype($key) == 'array') {
				list($qkey, $qval) = each($key);
				foreach ($this->data as $key => $row) {
					if ($row[$qkey] == $qval) {
						$this->remove($key);
						return true;
					}
				}
			}
			return false;
		}

		public function length()
		{
			return count($this->data);
		}

		public function filter($field, $value)
		{
			$data = array();
			$this->reset();
			while ($this->fetch()) {
				if ($this->get($field)->equal($value)) {
					$data[$this->key] = $this->resource[$this->key];
				}
			}
			$this->data = $data;
			return $this;
		}

		public function find($field, $value)
		{
			$data = array();
			$this->reset();
			while ($this->fetch()) {
				if ($this->get($field)->equal($value)) {
					$data[] = $this->resource[$this->key];
				}
			}
			return new SFDataClass($this->item, $data);
		}

		public function update($params)
		{
			if (gettype($params) == 'array') {
				if ($this->key !== false) {
					foreach ($params as $field => $value) {
						if (isset($this->data[$this->key][$field]))
						$this->get($field)->set($value);
					}
				}
				else {
					while ($this->fetch()) {
						foreach ($params as $field => $value) {
							if (isset($this->data[$this->key][$field]))
							$this->get($field)->set($value);
						}
					}
				}
			}
			return $this;
		}

		public static function drop($filepath)
		{
			if (file_exists(ENGINE.$filepath.EXT)) {
				unlink(ENGINE.$filepath.EXT);
			}
			else {
				die('File "'.$filepath.EXT.'" is not exists');
			}
		}

		public static function create($item, $paramsFileName)
		{
			$text = '<? if (!defined(\'ENGINE\')) die();'.N;
			$text .= '//@config '.$paramsFileName.EXT.N;
			$text .= T.'return array('.N;
			$text .= T.');'.N;
			if ($file = fopen(ENGINE.$item.EXT, 'w')) {
				fputs($file, $text);
				fclose($file);
			}
			return new SFDataClass($item);
		}

		public function save($path = false)
		{
			$text = '<? if (!defined(\'ENGINE\')) die();'.N;
			$text .= '//@config '.$this->paramsFileName.N;
			$text .= T.'return array('.N;
			foreach ($this->resource as $row) {
				$array_row = array();
				$tabs = 2;
				$text .= str_pad('', $tabs, T, STR_PAD_LEFT).'array('.N;
				foreach ($row as $field => $value) {
					if (is_numeric($value)) {
						$array_row[] = str_pad('', $tabs, T, STR_PAD_LEFT).T.'\''.$field.'\' => '.$value;
					}
					else if(gettype($value) == 'array') {
						$array_row[] = str_pad('', $tabs, T, STR_PAD_LEFT).T.'\''.$field.'\' => '.$this->saveRecArray($value, $tabs + 1);
					}
					else {
						$array_row[] = str_pad('', $tabs, T, STR_PAD_LEFT).T.'\''.$field.'\' => "'.$value.'"';
					}
				}
				$text .= implode(','.N, $array_row);
				$text .= N.str_pad('', $tabs, T, STR_PAD_LEFT).'),'.N;
			}
			$text .= T.');'.N;

			if ($path !== false) {
				if ($file = fopen(ENGINE.$path.EXT, 'w')) {
					fputs($file, $text);
					fclose($file);
				}
			}
			else if ($this->path !== false) {
				if ($file = fopen($this->path, 'w')) {
					fputs($file, $text);
					fclose($file);
				}
			}
			else {
				new SFError('Can\'t save data, cause have not file-path');
			}
		}

		private function saveRecArray($row, $tabs)
		{
			$array_row = array();
			$text = str_pad('', $tabs, T, STR_PAD_LEFT).'array('.N;
			foreach ($row as $field => $value) {
				if (is_numeric($value)) {
					$array_row[] = str_pad('', $tabs, T, STR_PAD_LEFT).T.'\''.$field.'\' => '.$value;
				}
				else if(gettype($value) == 'array') {
					$array_row[] = str_pad('', $tabs, T, STR_PAD_LEFT).T.'\''.$field.'\' => '.$this->saveRecArray($value, $tabs + 1);
				}
				else {
					$array_row[] = str_pad('', $tabs, T, STR_PAD_LEFT).T.'\''.$field.'\' => "'.$value.'"';
				}
			}
			$text .= implode(','.N, $array_row);
			$text .= N.str_pad('', $tabs, T, STR_PAD_LEFT).')';
			return $text;
		}

		public function add()
		{
			$add = array();
			foreach ($this->params as $field => $params) {
				$add[$field] = '';
			}
			$this->reset();
			$this->data[] = $add;
			end($this->data);
			$this->key = key($this->data);
			$this->fetch();
			if (func_num_args() == 1) {
				$addrow = func_get_arg(0);
				if (gettype($addrow) == 'array') {
					foreach ($this->params as $field => $params) {
						if (isset($addrow[$field])) {
							$this->get($field)->set($addrow[$field]);
						}
					}
				}
			}
			$this->resource = $this->data;
			return $this;
		}

		public function reset($resetData = true)
		{
			$this->key = false;
			if ($resetData) {
				$this->data = $this->resource;
			}
			reset($this->data);
			return $this;
		}
	}

	/**
	 * @param $item
	 *
	 * @return SFDataClass
	 */
	function SFData($item)
	{
		return new SFDataClass($item);
	}
