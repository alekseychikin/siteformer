<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  // get sections
  $sections = SFGUI::getSections();

  // if length then redir to first section
  if (count($sections)) {

  }

  // else redir to configs
  else {
    // SFResponse::redir('/cms/configs/add/');
  }

  SFResponse::render(SFTemplater::render('sections/main/index', 'sections/main/main', GUI_COMPILE_TEMPLATES));

?>
