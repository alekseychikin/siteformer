<?php

namespace Engine\Classes\Exceptions;

class PageNotFoundException extends \Exception {
	protected $message;

	public function __construct($message) {
		$this->message = $message;
	}

	public function message() {
		$trace = $this->getTrace();
		$newTrace = array();
		foreach ($trace as $entry) {
			$newTrace[] = $entry['file'] . ':' . $entry['line'];
		}
		ob_start();
		print_r($newTrace);
		$trace = ob_get_contents();
		ob_end_clean();
		$message = $this->message . ($this->errfile ? ' at file' . $this->errfile . ':' . $this->errline : '') . "\n" . $trace;
		return $message;
	}
}
