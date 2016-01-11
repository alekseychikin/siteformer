<?php

  include_once __dir__."/lime/parse_engine.php";
  include_once __dir__."/tokenizer.php";
  include_once __dir__."/parser.class";
  include_once __dir__."/tokens/tag.php";
  include_once __dir__."/tokens/tag_comment.php";
  include_once __dir__."/tokens/attribute.php";
  include_once __dir__."/tokens/text_node.php";
  include_once __dir__."/tokens/logic_node.php";
  include_once __dir__."/tokens/logic_node_echo.php";
  include_once __dir__."/tokens/logic_node_echo_modifier.php";
  include_once __dir__."/tokens/logic_and.php";
  include_once __dir__."/tokens/logic_or.php";
  include_once __dir__."/tokens/logic_equal.php";
  include_once __dir__."/tokens/logic_not_equal.php";
  include_once __dir__."/tokens/logic_lt_equal.php";
  include_once __dir__."/tokens/logic_gt_equal.php";
  include_once __dir__."/tokens/logic_lt.php";
  include_once __dir__."/tokens/logic_gt.php";
  include_once __dir__."/tokens/logic_not.php";
  include_once __dir__."/tokens/logic_assigment.php";
  include_once __dir__."/tokens/logic_expressions.php";
  include_once __dir__."/tokens/logic_list.php";
  include_once __dir__."/tokens/math_number.php";
  include_once __dir__."/tokens/math_concat.php";
  include_once __dir__."/tokens/math_var.php";
  include_once __dir__."/tokens/math_var_index.php";
  include_once __dir__."/tokens/math_function.php";
  include_once __dir__."/tokens/math_multiply.php";
  include_once __dir__."/tokens/math_devide.php";
  include_once __dir__."/tokens/math_plus.php";
  include_once __dir__."/tokens/math_minus.php";
  include_once __dir__."/tokens/math_uminus.php";
  include_once __dir__."/tokens/math_uplus.php";
  include_once __dir__."/tokens/math_brackets.php";
  include_once __dir__."/tokens/math_index_range.php";
  include_once __dir__."/tokens/reserved_word.php";

  include_once __dir__."/schemes/if.php";
  include_once __dir__."/schemes/for.php";
  include_once __dir__."/schemes/pair_tag.php";
  include_once __dir__."/schemes/pair_tag_close.php";
  include_once __dir__."/schemes/single_tag.php";
  include_once __dir__."/schemes/text_node.php";
  include_once __dir__."/schemes/assigment.php";
  include_once __dir__."/schemes/logic_echo.php";
  include_once __dir__."/schemes/requires.php";
  include_once __dir__."/schemes/tag_comment.php";

  class ParserE
  {
    private static $tokens;
    private static $parser;
    private static $schemes = array();
    private static $tree = null;

    public static function init()
    {
      self::$tokens = new Tokenizer(file_get_contents(__dir__.'/lexers.lex'));
      self::$parser = new parse_engine(new template_parser());
    }

    /**
     * Parse file by filepath
     *
     * @param string $filepath
     *
     * @return void AST tree
     */
    public static function parseFile($filepath, $reservedWords, $schemes)
    {
      return self::parse(file_get_contents($filepath), $reservedWords, $schemes, $filepath);
    }

    /**
     * Parse text
     *
     * @param string $strin
     *
     * @return void AST tree
     */
    public static function parse($strin, $reservedWords, $schemes, $filename = null)
    {
      self::$tokens->unshift('(' . implode('\s|', $reservedWords) . '\s) return TK_RESERVED_WORD');
      self::$tree = null;

      // if strin empty then return false
      if (!strlen($strin)) return false;

      // reset parse before begin parsing
      self::$parser->reset();

      // split text to  array of lines
      $lines = explode("\n", $strin);

      // remember last token and value for throw exception
      // if some problem happens
      $lastFoundedToken = '';
      $lastFoundedTokenValue = '';

      // each lines
      foreach ($lines as $lineNumber => $line) {
        // remember origin line for throw exception
        $originalLine = $line;

        // number of line counts from zero
        // and it's not quite good
        // it's better if line would counts from one
        $lineNumber++;

        // number of column
        // it's for throw exception
        $columnNumber = 0;

        // skip line if empty
        if (!strlen($line)) continue;

        // save origin formatting
        $line .= "\n";

        // feed parser by tockens from tokenizer
        while ($token = self::$tokens->nextToken($line)) {
          try {
            self::$parser->eat($token['token'], $token['value']);
          }
          catch (Exception $e) {
            // if parsing begun from file
            // then show error at file
            if ($filename) {
              echo $e->getMessage(). " at " . $filename . ":" . $lineNumber . ":" . $columnNumber . "\n";
            }

            // else show error without file
            else {
              echo $e->getMessage(). " at line " . $lineNumber . ":" . $columnNumber . "\n";
            }
            echo "Last token was (" . $lastFoundedToken . ")(" . $lastFoundedTokenValue . ")\n";
            echo $originalLine."\n";
            echo self::generateDashes('-', $columnNumber) . "^\n";
            return false;
          }

          // token had eaten fine
          // can remember new one
          $lastFoundedToken = $token['token'];
          $lastFoundedTokenValue = $token['value'];

          // column get transitioned too
          $columnNumber += strlen($token['value']);
        }
      }

      // finish parsing
      self::$parser->eat_eof();

      // until this moment parser return array of tags and logic nodes
      // and parser don't understand nesting
      // thats why the result of parsing should be prepared
      return self::prepareResults(self::$tree);
    }

    /**
     * Actualy this is private method for parser to save results
     */
    public static function saveResults($tree)
    {
      self::$tree = $tree;
    }

    /**
     * Prepare nodes from parser to AST tree
     */
    private static function prepareResults($nodes)
    {
      // all kind of element of tree is instance of ParseElement
      $root = new ParserElement();

      // array of nesting elements
      $nestings = array('root');

      // remember current element
      $curentElement = $root;

      try {

        // each nodes
        foreach ($nodes as $node) {

          // each schemes with trying to find fits one
          foreach (self::$schemes as $scheme) {

            // ParseEvent is element than helps to understand
            // is it nesting node ot not
            // fits this not to scheme or not
            $event = new ParserEvent();

            // pass scheme and node
            $event->check($scheme, $node);
            if ($event->isChecked()) {

              // create ParseElement with node and parentElement
              // because currentElement is parent for current node
              $elem = new ParserElement($node, $curentElement);

              // append created element to parent element
              $curentElement->appendChild($elem);

              // if type is not nesting then check last element keyword
              // from array of nestings
              // if it doesnt fits then trow exception
              // else get parent element and remember its as current element
              if ($event->isCloseNesting()) {
                $popKeyword = array_pop($nestings);
                if ($popKeyword != $event->getCloseNestingKeyword()) {
                  throw new Exception('Parser error: element `' . $event->getNestingKeyword() . '` not expected. Expected `'.$popKeyword.'`'."\n");
                }
                $curentElement = $elem->getParent();
              }

              // if type is nesting then append keywork to array of nestings
              // and remember current element
              if ($event->isNesting()) {
                $nestings[] = $event->getNestingKeyword();
                $elem->setNesting();
                $curentElement = $elem;
              }
            }
          }
        }
        if (count($nestings) > 1) {
          $popKeyword = array_pop($nestings);
          throw new Exception('Parser error: element `'.$popKeyword.'` not got closed'."\n");
        }
      }
      catch (Exception $e) {
        die($e->getMessage());
      }
      return $root;
    }

    private static function generateDashes($char, $number)
    {
      $str = '';
      for ($i = 0; $i < $number; $i++) {
        $str .= $char;
      }
      return $str;
    }

    public static function registerScheme($checkElement)
    {
      self::$schemes[] = array(
        'check' => $checkElement
      );
    }
  }

  ParserE::init();

  class ParserEvent
  {
    private $pairkeywordNesting;
    private $pairkeywordCloseNesting;
    private $isNesting = false;
    private $isCloseNesting = false;
    private $checkd = false;

    public function nesting($pairkeyword)
    {
      $this->isNesting = true;
      $this->pairkeywordNesting = $pairkeyword;
    }

    public function closeNesting($pairkeyword)
    {
      $this->isCloseNesting = true;
      $this->pairkeywordCloseNesting = $pairkeyword;
    }

    public function getNestingKeyword()
    {
      return $this->pairkeywordNesting;
    }

    public function getCloseNestingKeyword()
    {
      return $this->pairkeywordCloseNesting;
    }

    public function isNesting()
    {
      return $this->isNesting;
    }

    public function isCloseNesting()
    {
      return $this->isCloseNesting;
    }

    public function check($scheme, $node)
    {
      $this->checkd = $scheme['check']($node, $this);
    }

    public function isChecked()
    {
      return $this->checkd;
    }
  }

  class ParserElement
  {
    private $childs = array();
    private $parent;
    private $element;
    private $nesting = false;

    public function __construct($element = null, $parent = null)
    {
      $this->element = $element;
      $this->parent = $parent;
    }

    public function appendChild($element)
    {
      $this->childs[] = $element;
      return $this;
    }

    public function element()
    {
      return $this->element;
    }

    public function getChilds()
    {
      return $this->childs;
    }

    public function getParent()
    {
      return $this->parent;
    }

    public function nesting()
    {
      return $this->nesting;
    }

    public function setNesting()
    {
      $this->nesting = true;
    }


  }
