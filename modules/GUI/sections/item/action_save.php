<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$section = SFGUI::getSection($section);
$fields = $section['fields'];
$data = $_POST['data'];
$status = $data['status'];
unset($data['status']);

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
  $newData = ['status' => $status];

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $className::validateUpdateData($sectionName, $field, $currentData, $data);
  }

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $newData[$field['alias']] = $className::prepareUpdateData($sectionName, $field, $currentData, $data);
  }

  if ($status === 'public') {
    foreach ($fields as $field) {
      if ($field['required'] == "1" && (empty($newData[$field['alias']]))) {
        throw new ValidationException([
          'index' => [$field['alias']],
          'code' => 'EEMPTYREQUIREDVALUE'
        ]);
      }
    }
  }

  $record = SFORM::update($section['table'])
    ->values($newData)
    ->where('id', $id)
    ->exec();

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $className::postPrepareUpdateData($sectionName, $field, $newData, $data);
  }
} else {
  $newData = ['status' => $status];
  $sectionName = $data['section'];

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $className::validateInsertData($sectionName, $field, $data);
  }

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $newData[$field['alias']] = $className::prepareInsertData($sectionName, $field, $data);
  }

  if ($status === 'public') {
    foreach ($fields as $field) {
      if ($field['required'] == "1" && (empty($newData[$field['alias']]))) {
        throw new ValidationException([
          'index' => [$field['alias']],
          'code' => 'EEMPTYREQUIREDVALUE'
        ]);
      }
    }
  }

  $record = SFORM::insert($section['table'])
    ->values($newData)
    ->exec('default', true);

  foreach ($fields as $field) {
    $className = SFGUI::getClassNameByType($field['type']);
    $className::postPrepareInsertData($section, $field, $record, $data);
  }
}
