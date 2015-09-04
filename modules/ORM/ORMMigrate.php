<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFORMMigrate extends SFORMDatabase
  {
    private static $statuses = array('prepare', 'make', 'rollback');
    private static $status = 'prepare';
    private static $migrationsPath;
    private static $existsMigrations = array();
    private static $rules = array();
    private static $currentRules = array();
    private static $database = '';

    private static function getRuleItems()
    {
      $sql = '';
      foreach (self::$currentRules as $rule) {
        $sql .= $rule;
      }
      self::$rules[] = array(
        'rules' => self::$currentRules,
        'hash' => md5($sql)
      );
      self::$currentRules = array();
    }

    public function __construct()
    {
      if (count(self::$currentRules)) {
        self::getRuleItems();
      }
    }

    private static function writeMigrations()
    {
      $file = fopen(TEMP.'modules/ORM/migrations_'.self::$database.'.php', 'w');
      $content = "<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');\n\nreturn array(";
      $content .= "'" . implode("',\n'", self::$existsMigrations) . "'";
      $content .= ");\n\n?>";
      fputs($file, $content);
      fclose($file);
    }

    public static function getResult()
    {
      if (count(self::$currentRules)) {
        self::getRuleItems();
      }
      $lastIndex = 0;
      if (count(self::$existsMigrations)) {
        $lastHash = self::$existsMigrations[count(self::$existsMigrations) - 1];
        foreach (self::$rules as $index => $rule) {
          if ($rule['hash'] == $lastHash) {
            $lastIndex = $index + 1;
            break;
          }
        }
      }
      if ($lastIndex < count(self::$rules)) {
        for ($i = $lastIndex; $i < count(self::$rules); $i++) {
          $rules = self::$rules[$i];
          foreach ($rules['rules'] as $rule) {
            self::query($rule);
          }
          self::$existsMigrations[] = $rules['hash'];
        }
        self::writeMigrations();
      }
      return self::$rules;
    }

    public static function init($params)
    {
      self::$migrationsPath = $params['migrations'];
      self::$database = $params['database'];
      $base = 'default';
      if (isset($params['alias'])) {
        $base = $params['alias'];
      }
      SFORM::setBase($base);
      if (!file_exists(TEMP.'modules/ORM/')) SFPath::mkdir(TEMP.'modules/ORM/');
      if (!file_exists(TEMP.'modules/ORM/migrations_'.self::$database.'.php')) {
        $file = fopen(TEMP.'modules/ORM/migrations_'.self::$database.'.php', 'w');
        fputs($file, "<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');\n\nreturn array();\n\n?>");
        fclose($file);
      }
      self::$existsMigrations = include TEMP.'modules/ORM/migrations_'.self::$database.'.php';
      $dir = opendir(self::$migrationsPath);
      $files = array();
      while ($file = readdir($dir)) {
        if (substr($file, strrpos($file, '.') + 1) == 'php') {
          $files[] = self::$migrationsPath.$file;
        }
      }
      asort($files);
      foreach ($files as $file) {
        include $file;
      }
      self::getResult();
      SFORM::setBase('default');
    }

    public static function setStatus($status)
    {
      if (!in_array($status, self::$statuses)) die('unknown status '.$status);
      self::$status = $status;
    }

    public function createTable($tableName, $fields, $indexes = array())
    {
      $sql = SFORM::create($tableName, $fields, $indexes)->getSql();
      self::$currentRules[] = $sql;
      return $this;
    }

    public function addRow($table, $field)
    {
      $sql = 'ALTER TABLE `'.$table.'` ADD '.$field."\n";
      self::$currentRules[] = $sql;
      return $this;
    }

    public function changeRow($table, $fromField, $toField)
    {
      $sql = 'ALTER TABLE `'.$table.'` CHANGE `'.$fromField.'` '.$toField."\n";
      self::$currentRules[] = $sql;
      return $this;
    }

    public function removeRow($table, $field)
    {
      $sql = 'ALTER TABLE `'.$table.'` DROP `'.$field.'`';
      self::$currentRules[] = $sql;
      return $this;
    }

    public function updateRows($table, $field)
    {
      $sql = 'UPDATE `'.$table.'` '.$field;
      self::$currentRules[] = $sql;
      return $this;
    }
  }

?>
