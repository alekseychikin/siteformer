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
            if ($elements[0]->name() === 'if') {
              $e->nesting('if');
              return true;
            }
            else if ($elements[0]->name() === 'endif') {
              $e->closeNesting('if');
              return true;
            }
            else if ($elements[0]->name() === 'else') {
              $e->closeNesting('if');
              $e->nesting('if');
              return true;
            }
            else if ($elements[0]->name() === 'elseif') {
              $e->closeNesting('if');
              $e->nesting('if');
              return true;
            }
          }
        }
      }
    }
    return false;
  });
