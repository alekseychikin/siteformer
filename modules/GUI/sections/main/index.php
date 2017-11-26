<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

$user = SFResponse::get('user');

// get sections
$sections = SFERM::getCollections();

// if length then redir to first section
if (count($sections)) {
  SFResponse::redir('/cms/' . $sections[0]['alias'] . '/');
}

// else redir to configs
elseif ($user['role'] === 'admin') {
  SFResponse::redir('/cms/configs/add/');
} else {
  SFResponse::redir('/cms/profile/');
}
