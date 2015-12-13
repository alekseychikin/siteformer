<?php

  ParserE::registerScheme(function ($element, $e)
  {
    if (get_class($element) === 'LogicNodeEcho') {
      return true;
    }
    return false;
  });
