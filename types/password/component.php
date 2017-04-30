<?

	class SFTypePassword extends SFGUIType
	{
		public function set($value)
		{
			parent::set($this->translateValue($value));
		}

		public function equal($value)
		{
			return ($this->value === $this->translateValue($value) || $this->value === $value);
		}

		private function translateValue($value)
		{
			switch ($this->params['encode'])
			{
				case 'md5':
					$value = md5($value);
					break;
			}
			return $value;
		}
	}
