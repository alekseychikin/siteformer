<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$section = SFGUI::getSection($section);
$fields = $section['fields'];
$data = $_POST['data'];

// sort fields; some of them may should have a source
while (true) {
  $find = false;
  $lookingFor = false;
  $needSource = false;
  $mapIndexes = array();
  foreach ($fields as $index => $field) {
    $mapIndexes[$field['alias']] = $index;
    if ($lookingFor && $field['alias'] === $lookingFor) {
      array_splice($fields, $index, 1);
      array_splice($fields, $needSource, 0, array($field));
      $find = true;
      break;
    } else {
      $className = SFGUI::getClassNameByType($field['type']);
      if (method_exists($className, 'detectSource') && $className::detectSource($field)) {
        $lookingFor = $className::detectSource($field);
        $data[$field['alias']] = $data[$lookingFor];
        $needSource = $index;
        if (isset($mapIndexes[$lookingFor])) {
          $lookingFor = false;
        }
      }
    }
  }
  if (!$find) break;
}

$newData = array();

foreach ($fields as $field) {
  $className = SFGUI::getClassNameByType($field['type']);
  $newData[$field['alias']] = $className::prepareData($field, $data);
}

print_r($newData);

SFResponse::render();
