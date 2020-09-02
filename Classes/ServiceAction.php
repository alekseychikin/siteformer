<?php

namespace Engine\Classes;

class ServiceAction {
	private $model;
	private $action;
	private $params;

	public function __construct($model, $action, $params = []) {
		$this->model = $model;
		$this->action = $action;
		$this->params = $params;
	}

	public function getModel() {
		return $this->model;
	}

	public function getAction() {
		return $this->action;
	}

	public function getParams() {
		return $this->params;
	}
}
