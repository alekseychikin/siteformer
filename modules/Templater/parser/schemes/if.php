<?php

  ParserE::registerScheme(function ($element, $e)
  {
    if (get_class($element) == 'LogicNode') {
      $exprs = $element->exprs();
      if (get_class($exprs) === 'LogicExpressions') {
        $exprs = $exprs->exprs();
        if (get_class($exprs[0]) === 'ReservedWord') {
          $name = $exprs[0]->get();
          if ($name === 'if') {
            $e->nesting('if');
            return true;
          }
          else if ($name === 'endif') {
            $e->closeNesting('if');
            return true;
          }
          else if ($name === 'else') {
            $e->closeNesting('if');
            $e->nesting('if');
            return true;
          }
          else if ($name === 'elseif') {
            $e->closeNesting('if');
            $e->nesting('if');
            return true;
          }
        }
      }
    }
    return false;
  });
