<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/ERMGetItemSuper.php';

class SFERMGetItem extends SFERMGetItemSuper
{
  public function __construct($section) {
    parent::__construct($section);

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
