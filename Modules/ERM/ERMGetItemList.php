<?php

namespace Engine\Modules\ERM;

class ERMGetItemList extends ERMGetItemSuper {
	public function __construct($collection) {
		parent::__construct($collection);
	}

	public function exec($alias = 'default') {
		return $this->execAndGetItems($alias);
	}
}
