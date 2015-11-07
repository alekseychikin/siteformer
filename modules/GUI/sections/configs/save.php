<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  $modules = SFGUI::getModules();
  $modules[] = 'default';
  $types = array();
  arrMap(SFGUI::getTypes(), function ($type) use (& $types)
  {
    $types[] = $type['alias'];
  });

  $data = SFValidate::parse(array(
    array(
      'name' => 'title',
      'require' => true,
      'error' => 'Поле «Название» обязательно для заполнения, должно быть уникальным',
      'unique' => function ($value) {
        return !SFORM::select()->from('sections')->where('title', $value)->length();
      }
    ),
    array(
      'name' => 'alias',
      'require' => true,
      'valid' => '/^[a-zA-Z0-9\-_]+$/i',
      'error' => 'Поле «Веб-имя» обязательно для заполнения, должно содержать символы латинского алфавита, цифр, знака подчеркивания или дефиса',
      'unique' => function ($value) {
        return !SFORM::select()->from('sections')->where('alias', $value)->length();
      }
    ),
    array(
      'name' => 'module',
      'require' => true,
      'values' => $modules,
      'error' => 'Задан странный Модуль :value'
    ),
    array(
      'name' => 'fields',
      'minlength' => 1,
      'error' => 'Не заданы поля',
      'array' => array(
        array(
          'name' => 'title',
          'require' => true,
          'unique' => true,
          'error' => 'Уникальное имя, обязательное для заполнения',
          'skip_row_if_empty' => true
        ),
        array(
          'name' => 'alias',
          'require' => true,
          'unique' => true,
          'valid' => '/^[a-zA-Z0-9\-_]+$/i',
          'error' => 'Поле «Веб-имя» обязательно для заполнения, должно содержать символы латинского алфавита, цифр, знака подчеркивания или дефиса'
        ),
        array(
          'name' => 'type',
          'values' => $types,
          'error' => 'Зада странный тип поля :value'
        ),
        array(
          'name' => 'settings',
          'modify' => function ($settings) {
            return json_encode($settings);
          }
        )
      )
    )
  ), $_POST);

  $idSection = SFORM::insert('sections')
    ->values(array(
      'title' => $data['title'],
      'alias' => $data['alias'],
      'module' => $data['module']
    ))
    ->exec();

  arrMap($data['fields'], function ($field) use ($idSection)
  {
    SFORM::insert('section_fields')
      ->values(array(
        'section' => $idSection,
        'title' => $field['title'],
        'alias' => $field['alias'],
        'type' => $field['type'],
        'settings' => $field['settings']
      ))
      ->exec();
  });

?>
