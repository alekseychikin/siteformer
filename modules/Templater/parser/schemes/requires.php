<?php

  ParserE::registerScheme(function ($element, $e)
  {
    if (get_class($element) == 'LogicNode') {
      $exprs = $element->exprs();
      if (get_class($exprs) === "LogicExpressions") {
        $exprs = $exprs->exprs();
        if (get_class($exprs[0]) === 'ReservedWord') {
          $allowNames = array(
            'include',
            'require_template',
            'controller_page',
            'require_js',
            'require_css'
          );
          if (in_array($exprs[0]->get(), $allowNames)) {
            return true;
          }
        }
      }
    }
    return false;
  });
