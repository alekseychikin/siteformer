<?php

  ParserE::registerScheme(function ($element, $e)
  {
    if (get_class($element) == 'TextNode') {
      return true;
    }
    return false;
  });
