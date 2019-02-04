<?php

require_once __DIR__ . '/ERMGetItemSuper.php';

class SFERMGetItem extends SFERMGetItemSuper {
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
