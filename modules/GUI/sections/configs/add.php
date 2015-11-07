<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  SFResponse::set('page_title', 'Добавить раздел');

  $sections = SFGUI::getSections();
  $modules = SFGUI::getModules();
  $types = SFGUI::getTypes();
  list($index, $firstType) = each($types);

  $fields = array(
    array(
      'title' => '',
      'alias' => '',
      'type' => $firstType['alias'],
      'settings' => $firstType['defaultSettings']
    )
  );

  SFResponse::set('types', $types);
  SFResponse::set('sections', $sections);
  SFResponse::set('modules', $modules);
  SFResponse::set('section', 'configs');
  SFResponse::set('fields', $fields);
  SFResponse::set('title', '');
  SFResponse::set('alias', '');
  SFResponse::set('module', 'default');
  SFResponse::render(SFTemplater::render('configs/add', 'main/main', TEMP.'modules/GUI/.compile_templates/sections/'));

?>
