<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  SFResponse::set('page_title', 'Настройки');

  $sections = SFGUI::getSections();
  $modules = SFGUI::getModules();

  SFResponse::set('modules', $modules);
  SFResponse::set('sections', $sections);
  SFResponse::set('section', 'configs');
  SFResponse::render(SFTemplater::render('configs/index', 'main/main', ENGINE . 'temp/modules/GUI/.compile_templates/sections/'));

?>
