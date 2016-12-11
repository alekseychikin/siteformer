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

if (isset($data['id']) && isset($data['section'])) {
  $id = $data['id'];
  $sectionName = $data['section'];
  $section = SFGUI::getSection($sectionName);
  unset($data['id']);
  unset($data['section']);

  $currentData = SFGUI::getItem($sectionName)
    ->where('id', $id)
    ->exec();
  $newData = array();

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $className::validateUpdateData($sectionName, $field, $currentData, $data);
  }

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $newData[$field['alias']] = $className::prepareUpdateData($sectionName, $field, $currentData, $data);
  }

  $record = SFORM::update($section['table'])
    ->values($newData)
    ->where('id', $id)
    ->exec();

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $className::postPrepareUpdateData($sectionName, $field, $newData, $data);
  }

  die();
} else {
  $newData = array();

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $className::validateInsertData($section, $field, $data);
  }

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $newData[$field['alias']] = $className::prepareInsertData($section, $field, $data);
  }

  $record = SFORM::insert($section['table'])
    ->values($newData)
    ->exec('default', true);

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $className::postPrepareUpdateData($section, $field, $record, $currentData, $newData, $data);
  }

  SFResponse::showContent();
  print_r($newData);
}
