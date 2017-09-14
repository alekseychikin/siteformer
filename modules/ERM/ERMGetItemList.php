<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/ERMGetItemSuper.php';

class SFERMGetItemList extends SFERMGetItemSuper
{
  public function __construct($section) {
    parent::__construct($section);
  }

  public function exec($alias = 'default') {
    return $this->execAndGetItems($alias);
  }
}
