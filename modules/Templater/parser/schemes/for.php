<?php

  ParserE::registerScheme(function ($element, $e)
  {
    if (get_class($element) == 'LogicNode') {
      $exprs = $element->exprs();
      if (get_class($exprs) === "LogicExpressions") {
        $exprs = $exprs->exprs();
        if (get_class($exprs[0]) === 'MathConcat') {
          $elements = $exprs[0]->elements();
          if (count($elements) === 1) {
            if ($elements[0]->name() == 'for') {
              $e->nesting('for');
              return true;
            }
            else if ($elements[0]->name() == 'endfor') {
              $e->closeNesting('for');
              return true;
            }
          }
        }
      }
    }
    return false;
  });
