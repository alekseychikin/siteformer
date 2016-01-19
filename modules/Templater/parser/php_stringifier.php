<?php

  class PhpStringifier
  {
    private static $resultString = '';
    private static $arrIndex = 0;

    public static function stringify($tree)
    {
      self::$resultString = '';
      self::recString($tree);
      return self::$resultString;
    }

    private static function handleInclude($exprs)
    {
      $params = '';
      if (count($exprs) > 2) {
        $params = array();
        for ($i = 2; $i < count($exprs); $i++) {
          $params[] = '\'' . substr(self::handleRecursiveExpression($exprs[$i]->leftPart()), 1) . '\' => ' . self::handleRecursiveExpression($exprs[$i]->rightPart());
        }
        $params = ', array(' . implode(', ', $params) . ')';
      }
      return 'SFTemplater::inc(' . self::handleRecursiveExpression($exprs[1]) . $params . ');';
    }

    private static function handleControllerPage($exprs)
    {
      return 'SFTemplater::requireControllerPage(' . self::handleRecursiveExpression($exprs[1]) . ');';
    }

    private static function handleIf($exprs)
    {
      $values[] = 'if ( ';
      foreach ($exprs as $index => $expr) {
        if (!$index) continue;
        $values[] = self::handleRecursiveExpression($expr);
      }
      $values[] = ') {';
      return implode('', $values);
    }

    private static function handleElseIf($exprs)
    {
      $values[] = '} else if ( ';
      foreach ($exprs as $index => $expr) {
        if (!$index) continue;
        $values[] = self::handleRecursiveExpression($expr);
      }
      $values[] = ') {';
      return implode('', $values);
    }

    private static function handleElse($exprs)
    {
      return '} else {';
    }

    private static function handleEndif($exprs)
    {
      return '}';
    }

    private static function getFirstElementFromConcat($expr)
    {
      if (get_class($expr) === 'MathConcat') {
        $elements = $expr->elements();
        return $elements[0];
      }
      return $expr;
    }

    private static function handleFor($exprs)
    {
      $arr = '';
      $exprs[3] = self::getFirstElementFromConcat($exprs[3]);
      if (get_class($exprs[3]) === 'MathIndexRange') {
        $arr = '$arr' . self::$arrIndex . ' = MakeArray(' . self::handleRecursiveExpression($exprs[3]->leftPart()) .
          ', ' .
          self::handleRecursiveExpression($exprs[3]->rightPart()) .
          '); ';
      }
      else {
        $arr = '$arr' . self::$arrIndex . ' = ' . self::handleRecursiveExpression($exprs[3]) . '; ';
      }
      if (self::getFirstElementFromConcat($exprs[2])->get() === 'revertin') {
        $arr .= '$arr' . self::$arrIndex . ' = array_reverse($arr' . self::$arrIndex . ', true); ';
      }
      $values = $arr;
      $values .= 'foreach ($arr' . self::$arrIndex . ' as ';
      if (get_class(self::getFirstElementFromConcat($exprs[1])) === 'LogicList') {
        $items = self::getFirstElementFromConcat($exprs[1])->getItems();
        $values .= self::handleRecursiveExpression($items[0]) .
          ' => ' .
          self::handleRecursiveExpression($items[1]);
      }
      else {
        $values .= self::handleRecursiveExpression($exprs[1]);
      }
      $values .= ') {';
      self::$arrIndex++;
      return $values;
    }

    private static function handleEndfor($exprs)
    {
      return '}';
    }

    private static function handleRecursiveExpressions($exprs)
    {
      $values = array();
      if (gettype($exprs) === 'array') {
        foreach ($exprs as $expr) {
          $values[] = self::handleRecursiveExpression($expr);
        }
      }
      else if (gettype($exprs) === 'object') {
        return self::handleRecursiveExpression($exprs);
      }
      else {
        return $exprs;
      }
      return implode('', $values);
    }

    private static function handleRecursiveExpression($expr)
    {
      if (gettype($expr) !== 'object')  {
        if (gettype($expr) === 'boolean' || is_numeric($expr)) {
          return $expr;
        }
        return '"' . $expr . '"';
      }
      switch (get_class($expr)) {
        case 'MathVar':
          return self::handleMathVar($expr);
        case 'LogicNotEqual':
          return self::handleLogicNotEqual($expr);
        case 'MathFunction':
          return self::handleMathFunction($expr);
        case 'MathPlus':
          return self::handleMathPlus($expr);
        case 'MathUPlus':
          return self::handleMathUPlus($expr);
        case 'MathUMinus':
          return self::handleMathUMinus($expr);
        case 'MathMinus':
          return self::handleMathMinus($expr);
        case 'MathDevide':
          return self::handleMathDevide($expr);
        case 'MathMultiply':
          return self::handleMathMultiply($expr);
        case 'MathNumber':
          return self::handleMathNumber($expr);
        case 'MathBrackets':
          return self::handleMathBrackets($expr);
        case 'LogicLTEqual':
          return self::handleLogicLTEqual($expr);
        case 'LogicGTEqual':
          return self::handleLogicLTEqual($expr);
        case 'LogicLT':
          return self::handleLogicLT($expr);
        case 'LogicGT':
          return self::handleLogicGT($expr);
        case 'LogicAnd':
          return self::handleLogicAnd($expr);
        case 'LogicOr':
          return self::handleLogicOr($expr);
        case 'LogicEqual':
          return self::handleLogicEqual($expr);
        case 'LogicNotEqual':
          return self::handleLogicEqual($expr);
        case 'MathConcat':
          return self::handleMathConcat($expr);
        case 'LogicAssigment':
          return self::handleLogicAssigment($expr);
        case 'LogicNot':
          return self::handleLogicNot($expr);
      }
    }

    private static function handleLogicNot($expr)
    {
      return '!(' . self::handleRecursiveExpression($expr->expr()) . ')';
    }

    private static function handleLogicAnd($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' && ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleLogicOr($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' || ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleMathConcat($expr)
    {
      $values = array();
      $elements = $expr->elements();
      foreach ($elements as $element) {
        $values[] = self::handleRecursiveExpression($element);
      }
      return implode(' . ', $values);
    }

    private static function handleMathMultiply($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' * ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleMathDevide($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' / ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleMathUMinus($expr)
    {
      return '-' . self::handleRecursiveExpression($expr->expr());
    }

    private static function handleMathUPlus($expr)
    {
      return '+' . self::handleRecursiveExpression($expr->expr());
    }

    private static function handleMathMinus($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' - ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function LogicNotEqual($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' != ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleLogicEqual($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' == ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function LogicGT($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' > ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleLogicGT($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' > ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleLogicLT($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' < ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function LogicGTEqual($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' >= ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleLogicLTEqual($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' <= ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleMathBrackets($expr)
    {
      return '(' . self::handleRecursiveExpression($expr->expr()) . ')';
    }

    private static function handleMathNumber($expr)
    {
      return $expr->value();
    }

    private static function handleMathPlus($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' + ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleMathFunction($expr)
    {
      $values = $expr->name()->name() . '(';
      $params = $expr->params();
      $parameters = array();
      foreach ($params as $param) {
        $parameters[] = self::handleRecursiveExpression($param);
      }
      if (count($parameters)) {
        $values .= implode(', ', $parameters);
      }
      return $values . ')';
    }

    private static function handleLogicNotEqual($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' != ' .
        self::handleRecursiveExpression($expr->rightPart());
    }

    private static function handleMathVar($expr)
    {
      $isCheckVariable = $expr->isCheck();
      $values = '';
      if (in_array($expr->name(), array('true', 'false'))) {
        $variableName = $expr->name();
      }
      else {
        $variableName = '$' . $expr->name();
      }
      if ($isCheckVariable) {
        $values .= ' (isset(' . $variableName . ') ? ';
      }
      $indexes = $expr->indexes();
      if (count($indexes)) {
        $values .= self::handleMathVarIndex($variableName, $indexes);
      }
      else {
        $values .= $variableName;
      }
      if ($isCheckVariable) {
        $values .= ' : \'\') ';
      }
      return $values;
    }

    private static function handleMathVarIndex($variableName, $indexes)
    {
      $values = '';
      if (count($indexes)) {
        $index = array_shift($indexes);

        $name = $index->name();
        $isCheck = $index->isCheck();

        $variable = '';
        if (is_numeric($name)) {
          $variable = '[' . $name . ']';
        }
        else if (gettype($name) === 'string') {
          $variable = '[\'' . $name . '\']';
        }
        else if (gettype($name) === 'object') {
          $variable = '[';
          $variable .= self::handleRecursiveExpression($name);
          $variable .= ']';
        }

        if ($isCheck) {
          return '( isset (' . $variableName . $variable . ') ? ' . self::handleMathVarIndex($variableName . $variable, $indexes) . ' : \'\')';
        }
        else {
          return self::handleMathVarIndex($variableName . $variable, $indexes);
        }
      }
      else {
        return $variableName;
      }
      return $values;
    }

    private static function expandLogicExpressions($element)
    {
      $exprs = $element->exprs();
      if (get_class($element) === 'LogicNode') {
        $text = self::handleLogicExpressions($exprs);
        if ($text !== false) {
          return '<?php ' . $text . ' ?>';
        }
      }
      else if (get_class($element) === 'LogicNodeEcho') {
        return '<?php echo (' . self::handleRecursiveExpressions($exprs->exprs()) . '); ?>';
      }
      return '';
    }

    private static function handleLogicAssigment($expr)
    {
      return self::handleRecursiveExpression($expr->leftPart()) .
        ' = ' .
        self::handleRecursiveExpressions($expr->rightPart()) . ';';
    }

    private static function handleLogicExpressions($exprs)
    {
      $exprs = $exprs->exprs();
      $name = false;
      if (get_class($exprs[0]) === 'ReservedWord') {
        $name = $exprs[0]->get();
      }
      if ($name !== false) {
        switch ($name) {
          case 'if':
            return self::handleIf($exprs);
          case 'else':
            return self::handleElse($exprs);
          case 'elseif':
            return self::handleElseIf($exprs);
          case 'endif':
            return self::handleEndif($exprs);
          case 'for':
            return self::handleFor($exprs);
          case 'endfor':
            return self::handleEndfor($exprs);
          case 'include':
            return self::handleInclude($exprs);
          case 'controller_page':
            return self::handleControllerPage($exprs);
        }
      }
      else if (get_class($exprs[0]) === 'LogicAssigment') {
        return self::handleRecursiveExpressions($exprs);
      }
    }

    private static function prepareAttribute($attribute)
    {
      if (get_class($attribute) == 'Attribute') {
        $values = $attribute->values();
        $value = array();
        if (gettype($values) == 'array') {
          foreach ($values as $val) {
            if (gettype($val) == 'object' && (get_class($val) == 'LogicNode' || get_class($val) == 'LogicNodeEcho')) {
              $value[] = self::handleLogicNode($val);
            }
            else {
              $value[] = $val;
            }
          }
        }
        if (!count($value)) {
          return ' '.$attribute->name();
        }
        return ' '.$attribute->name() . '="' . implode('', $value) . '"';
      }
      elseif (get_class($attribute) == 'LogicNode' || get_class($attribute) == 'LogicNodeEcho') {
        return self::handleLogicNode($attribute);
      }
      return '';
    }

    private static function prepareTag($element)
    {
      self::$resultString .= '<' . ($element->type() == 'close' ? '/' : '') . $element->name();
      $attributes = $element->attributes();
      foreach ($attributes as $attribute) {
        self::$resultString .= self::prepareAttribute($attribute);
      }
      self::$resultString .= '>';
    }

    private static function prepareTagComment($element)
    {
      self::$resultString .= '<!--' . $element->text() . '-->';
    }

    private static function prepareTextNode($element)
    {
      self::$resultString .= $element->text();
    }

    private static function handleLogicNode($element)
    {
      if (get_class($element) === 'LogicNodeEcho') {
        $modifiers = $element->modifiers();
        if (count($modifiers)) {
          return '<?php echo ' . self::handleLogicNodeModifiers($element, $modifiers) . '; ?>';
        }
      }
      return self::expandLogicExpressions($element);
    }

    private static function handleLogicNodeModifiers($element, $modifiers)
    {
      if (count($modifiers)) {
        $modify = array_shift($modifiers);
        $params = $modify->params();
        if (gettype($params) === 'array' && count($params)) {
          $attribs = array();
          foreach ($params as $param) {
            $attribs[] = self::handleRecursiveExpression($param);
          }
          return $modify->name() . '(' . self::handleLogicNodeModifiers($element, $modifiers) . ' ,' . implode(', ', $attribs) . ')';
        }
        return $modify->name() . '(' . self::handleLogicNodeModifiers($element, $modifiers) . ')';
      }
      return self::handleRecursiveExpressions($element->exprs()->exprs());
    }

    private static function prepareLogicNode($sourceElement)
    {
      self::$resultString .= self::handleLogicNode($sourceElement);
    }

    private static function recString($tree)
    {
      if ($tree === false) {
        $childs = array();
      }
      else {
        $childs = $tree->getChilds();
      }
      foreach ($childs as $element) {
        $sourceElement = $element->element();
        switch (get_class($sourceElement)) {
          case 'Tag':
            self::prepareTag($sourceElement);
            break;
          case 'TagComment':
            self::prepareTagComment($sourceElement);
            break;
          case 'TextNode':
            self::prepareTextNode($sourceElement);
            break;
          case 'LogicNode':
            self::prepareLogicNode($sourceElement);
            break;
          case 'LogicNodeEcho':
            self::prepareLogicNode($sourceElement);
            break;
        }
        self::recString($element);
      }
    }
  }

  function makeArray($start, $end)
  {
    $arr = array();
    $start = str_replace(',', '.', $start);
    $end = str_replace(',', '.', $end);
    settype($start, 'integer');
    settype($end, 'integer');
    for ($i = $start; $i <= $end; $i++) {
      $arr[] = $i;
    }
    return $arr;
  }

  function length($str)
  {
    return strlen($str);
  }
