<?php

namespace Engine\Modules\ERM;

class ERMGetItem extends ERMGetItemSuper {
	public function __construct($collection) {
		parent::__construct($collection);

		$this->limit(1);
	}

	public function exec($alias = 'default') {
		$data = $this->execAndGetItems($alias);

		if (!count($data)) {
			return false;
		}

		return $data[0];
	}
}
