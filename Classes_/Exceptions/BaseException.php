<?php

namespace Engine\Classes\Exceptions;

class BaseException extends Exception {
	protected $message;
	private $errfile = false;
	private $errline = false;

	public function __construct($message = '', $errfile = false, $errline = false) {
		$this->message = $message;

		if ($errfile !== false) $this->errfile = $errfile;
		if ($errline !== false) $this->errline = $errline;
	}

	public function message($withTrace = true) {
		$trace = $this->getTrace();
		$newTrace = array();

		if (gettype($trace) === 'array') {
			foreach ($trace as $index => $entry) {
				if (!isset($entry['file']) || !isset($entry['line'])) continue;

				$newTrace[] = $entry['file'] . ':' . $entry['line'];
			}
		}

		ob_start();
		echo(join("\n", $newTrace));
		$trace = ob_get_contents();
		ob_end_clean();

		SFResponse::error(500, $this->message, $this->errfile, $this->errline, $trace);
	}
}
