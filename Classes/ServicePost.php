<?php

namespace Engine\Classes;

class ServicePost {
	private $model;
	private $params;

	public function __construct($model, $params = []) {
		$this->model = $model;
		$this->params = $params;
	}

	public function getModel() {
		return $this->model;
	}

	public function getParams() {
		return $this->params;
	}
}
