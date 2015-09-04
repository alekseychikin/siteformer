<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

	class SFType
	{
		protected $value;
		protected $params = array();
		protected $object;
		protected $field;

		public function set($value)
		{
			$this->value = $value;
			if (gettype($this->object) == 'object') {
				$this->object->set($this->field, $value);
			}
			return $value;
		}

		public function setDefault($value)
		{
			$this->value = $value;
		}

		public function get()
		{
			return $this->value;
		}

		public function remove()
		{
			$this->set('');
		}

		public function setParams($params)
		{
			$this->params = $params;
		}

		public function setObject($object, $field)
		{
			$this->object = $object;
			$this->field = $field;
		}

		public function equal($value)
		{
			return $this->value == $value;
		}

		public static function getSqlType()
		{
			return 'VARCHAR(250) NOT NULL';
		}
	}
