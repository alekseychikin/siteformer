#!/usr/bin/env php
<?php

$cmd = $argv[1];

function getValue($keys, & $i) {
  global $argv, $argc;

  if (isset($argv[$i + 1]) && !in_array($argv[$i + 1], $keys)) {
    $i += 1;

    return $argv[$i];
  }

  return "";
}

function connectDatabase() {
  global $argv, $argc;

  $keys = ["-h", "-u", "-p", "-d"];

  $host = false;
  $user = false;
  $password = false;
  $database = false;

  for ($i = 2; $i < $argc; $i++) {
    switch ($argv[$i]) {
      case "-h":
        $host = getValue($keys, $i);
        break;
      case "-u":
        $user = getValue($keys, $i);
        break;
      case "-p":
        $password = getValue($keys, $i);
        break;
      case "-d":
        $database = getValue($keys, $i);
        break;
    }
  }

  if ($host !== false && $user !== false && $password !== false && $database !== false) {
    $file = fopen(__DIR__ . "/configs/database.php", "w");
    $databaseConfig = <<<DEC
<?php

return [
  'host' => '$host',
  'user' => '$user',
  'password' => '$password',
  'database' => '$database'
];
DEC;
    fputs($file, $databaseConfig);
    fclose($file);
    echo "New database configs:\nHost: $host\nUser: $user\nPassword: $password\nDatabase: $database\n";
  } else {
    echo "Database configs invalid\n";
  }
}

switch ($cmd) {
  case "connect-database":
    connectDatabase();
    break;
  default:
    echo "Unrecognised command\n";
}

exit(0);
