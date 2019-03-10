<?php

namespace Engine\Modules\Router;

class RouterRoute {
	private $data;
	private $template;

	public function __construct($data, $template) {
		$this->data = $data;
		$this->template = $template;
	}

	public function getData() {
		return $this->data;
	}

	public function getTemplate() {
		return $this->template;
	}
}
