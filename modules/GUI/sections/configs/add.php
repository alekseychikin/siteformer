<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  $sections = SFGUI::getSections();
  $modules = SFGUI::getModules();
  $types = SFGUI::getTypes();

  $fields = array(
    array(
      'title' => '',
      'alias' => '',
      'type' => 'string'
    )
  );

  SFResponse::set('types', $types);
  SFResponse::set('sections', $sections);
  SFResponse::set('modules', $modules);
  SFResponse::set('section', 'configs');
  SFResponse::set('fields', $fields);
  SFResponse::render(SFTemplater::render('configs/add', 'main/main', TEMP.'modules/GUI/.compile_templates/sections/'));

?>
