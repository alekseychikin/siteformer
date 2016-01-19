<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  SFResponse::set('page_title', 'Добавить запись');

  $section = SFGUI::getSection($section);

  $sections = SFGUI::getSections();
  SFResponse::set('sections', $sections);
  SFResponse::set('section', $section['alias']);
  SFResponse::set('fields', $section['fields']);

  SFResponse::render(SFTemplater::render('sections/item/add', 'sections/main/main', GUI_COMPILE_TEMPLATES));

?>
