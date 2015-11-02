<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  $modules = SFGUI::getModules();
  SFResponse::set('modules', $modules);
  SFResponse::set('module', 'configs');
  SFResponse::render(SFTemplater::render('configs/index', 'main', TEMP.'modules/GUI/.compile_templates/'));

?>
