<?php

  ParserE::registerScheme(function ($element, $e)
  {
    $singleTags = array('hr', 'br', 'base', 'col', 'embed', 'img', 'area', 'source', 'track', 'input', '!DOCTYPE', 'link', 'meta');
    if (get_class($element) == 'Tag') {
      $name = $element->name();
      if ($element->type() == 'open' && !in_array($name, $singleTags)) {
        $e->nesting($name);
        return true;
      }
    }
    return false;
  });
