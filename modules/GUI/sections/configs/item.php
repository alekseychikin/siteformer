<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  $section = SFGUI::getSection($section);
  SFResponse::set('page_title', 'Редактировать раздел «' . $section['title'] . '»');

  $sections = SFGUI::getSections();
  $modules = SFGUI::getModules();
  $types = SFGUI::getTypes();
  list($index, $firstType) = each($types);

  $fields = $section['fields'];

  SFResponse::set('types', $types);
  SFResponse::set('sections', $sections);
  SFResponse::set('modules', $modules);
  SFResponse::set('section', 'configs');
  SFResponse::set('id', $section['id']);
  SFResponse::set('title', $section['title']);
  SFResponse::set('alias', $section['alias']);
  SFResponse::set('module', $section['module']);
  SFResponse::set('fields', $fields);
  SFResponse::render(SFTemplater::render('configs/add', 'main/main', ENGINE . 'temp/modules/GUI/.compile_templates/sections/'));

?>
