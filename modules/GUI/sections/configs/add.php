<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

SFResponse::set('page_title', 'Добавить раздел');

SFResponse::set('types', SFGUI::getTypes());
SFResponse::set('sections', SFGUI::getSections());
SFResponse::set('modules', SFGUI::getModules());
SFResponse::set('section', 'configs');
SFResponse::set('fields', SFGUI::getNewFields());
SFResponse::set('title', '');
SFResponse::set('alias', '');
SFResponse::set('module', 'default');
echo SFTemplater::render('sections/configs/add', 'sections/main/main', GUI_COMPILE_TEMPLATES);
