<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  $modules = SFGUI::getModules();
  $modules[] = 'default';
  $types = array();
  arrMap(SFGUI::getTypes(), function ($type) use (& $types)
  {
    $types[] = $type['alias'];
  });

  SFORM::showError();
  $data = SFValidate::parse(array(
    array(
      'name' => 'title',
      'require' => true,
      'error' => 'Поле «Название» обязательно для заполнения, должно быть уникальным',
      'unique' => function ($value) {
        $res = SFORM::select()
          ->from('sections')
          ->where(_and_(
            _expr_('title', $value),
            _expr_('enable', 'IS NOT', NULL)
          ));
        return !$res->length();
      }
    ),
    array(
      'name' => 'alias',
      'require' => true,
      'valid' => '/^[a-zA-Z0-9\-_]+$/i',
      'error' => 'Поле «Веб-имя» обязательно для заполнения, должно содержать символы латинского алфавита, цифр, знака подчеркивания или дефиса',
      'unique' => function ($value) {
        $res = SFORM::select()
          ->from('sections')
          ->where(_and_(
            _expr_('alias', $value),
            _expr_('enable', 'IS NOT', NULL)
          ));
        return !$res->length();
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
          'name' => 'id',
          'require' => false,
          'valid' => '/^\d+$/',
          'error' => 'Уникальный айди'
        ),
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

  $id = SFGUI::addSection($data);
  SFResponse::set('section', SFGUI::getSectionById($id));
  SFResponse::render();

?>