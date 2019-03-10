<?php

namespace Engine\Modules\Templater;

class Templater {
	public static $templatesPath;

	public static function setTemplatesPath($path) {
		self::$templatesPath = $path;
	}

	public static function setCompilesPath($compilePath) {
		self::$templatesPath = $compilePath;
	}

	public static function render($template, $data = [], $compilePath = null) {
		$content = '';

		if (!$compilePath) {
			$compilePath = self::$templatesPath;
		}

		if (!empty($template)) {
			ob_start();

			$path = pathresolve($compilePath, $template);

			if (file_exists($path)) {
				$templateRender = include($path);
				echo $templateRender($data);
			} else {
				ob_end_clean();
				die('template not found: ' . $path);
			}

			$content = ob_get_contents();
			ob_end_clean();
		}

		return trim($content);
	}
}
