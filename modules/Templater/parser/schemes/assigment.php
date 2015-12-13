<?php

  ParserE::registerScheme(function ($element, $e)
  {
    if (get_class($element) === 'LogicNode') {
      $exprs = $element->exprs()->exprs();
      if (get_class($exprs[0]) === "LogicAssigment") {
        return true;
      }
    }
    return false;
  });
