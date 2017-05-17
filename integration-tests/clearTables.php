<?php

if (!defined('ROOT')) {
  define('ROOT', __DIR__ . '/../');
}

require_once __DIR__ . '/../modules/ORM/ORM.php';
$configs = include __DIR__ . '/../../config/database.php';

SFORMDatabase::init($configs);

SFORM::query('TRUNCATE TABLE `sys_section_fields`');
SFORM::query('TRUNCATE TABLE `sys_section_fields_users`');
SFORM::query('TRUNCATE TABLE `sys_sections`');
SFORM::drop('string1');
