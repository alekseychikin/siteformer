<?php

  class LogicList
  {
    private $items = array();

    public function __construct($firstItem, $secondItem)
    {
      $this->items[] = $firstItem;
      $this->items[] = $secondItem;
    }

    public function addItem($item)
    {
      $this->items[] = $item;
    }

    public function getItems()
    {
      return $this->items;
    }
  }
