<?php

namespace Engine\Classes\Exceptions;

class ValidateException extends Exception {
	protected $message;
	protected $details;
	protected $file = false;
	protected $line = false;

	public function __construct($message = '', $file = false, $line = false) {
		$this->details = $message;
		$this->message = 'Validate Exception. Get details by ::getDetails()';
		$this->file = $file;
		$this->line = $line;
	}

	public function getDetails() {
		return $this->details;
	}
}
