<?php

  ParserE::registerScheme(function ($element, $e)
  {
    if (get_class($element) == 'LogicNode') {
      $exprs = $element->exprs();
      if (get_class($exprs) === 'LogicExpressions') {
        $exprs = $exprs->exprs();
        if (get_class($exprs[0]) === 'ReservedWord') {
          $name = $exprs[0]->get();
          if ($name == 'for') {
            $e->nesting('for');
            return true;
          }
          else if ($name == 'endfor') {
            $e->closeNesting('for');
            return true;
          }
        }
      }
    }
    return false;
  });
