<?php

  ParserE::registerScheme(function ($element, $e)
  {
    $singleTags = array('hr', 'br', 'base', 'col', 'embed', 'img', 'area', 'source', 'track');
    if (get_class($element) == 'Tag') {
      $name = $element->name();
      if ($element->type() == 'close') {
        $e->closeNesting($name);
        return true;
      }
    }
    return false;
  });
