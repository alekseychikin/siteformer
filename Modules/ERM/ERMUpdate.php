<?php

namespace Engine\Modules\ERM;

require_once __DIR__ . '/ERMGetItemSuper.php';

use \Engine\Modules\ORM\ORM;

class ERMUpdate extends ERMGetItemSuper {
	private $params;

	public function __construct($collection, $params) {
		parent::__construct($collection);

		$this->params = $params;
	}

	public function exec($alias = 'default') {
		$currentItems = $this->execAndGetItems($alias);

		$fields = self::sortFields($this->collection['fields'], $data);

		foreach ($currentItems as $currentData) {
			$data = $this->params['data'];
			$status = isset($this->params['status']) ? $this->params['status'] : $currentData['status'];
			$newData = [
				'id' => $currentData['id'],
				'status' => $status,
				'usermodify' => $params['user'],
				'datemodify' => gmdate('Y-m-d H:i:s')
			];

			foreach ($fields as $field) {
				if (!isset($data[$field['alias']])) continue;

				$className = ERM::getClassNameByType($field['type']);
				$className::validateUpdateData($collection['alias'], $field, $currentData, $data);
			}

			foreach ($fields as $field) {
				if (!isset($data[$field['alias']])) continue;

				$className = ERM::getClassNameByType($field['type']);

				if ($className::hasSqlField()) {
					$newData[$field['alias']] = $className::prepareUpdateData($collection['alias'], $field, $currentData, $data);
				}
			}

			if ($status === 'public') {
				foreach ($fields as $field) {
					if ($field['required'] === true && (empty($newData[$field['alias']]))) {
						throw new ValidateException([
							'index' => [$field['alias']],
							'code' => 'EEMPTYREQUIREDVALUE'
						]);
					}
				}
			}

			ORM::update($this->collection['table'])
			->values($newData)
			->where('id', $currentData['id'])
			->exec();

			foreach ($fields as $field) {
				$className = ERM::getClassNameByType($field['type']);
				$className::postPrepareUpdateData($this->collection, $field, $newData, $data);
			}
		}

		return $this->execAndGetItems($alias);
	}
}
