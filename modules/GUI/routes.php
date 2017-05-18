<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

return [
  '/cms/' => MODULES . 'GUI/sections/main/index',
  '/cms/configs/' => [
    'data' => [
      'page-title' => 'gui-scalar?value=Настройки',
      'section' => 'gui-scalar?value=configs',
      'sections' => 'gui-sections',
      'modules' => 'gui-modules'
    ],
    'template' => 'sections/configs/index.tmplt'
  ],
  '/cms/configs/add/' => [
    'data' => [
      'types' => 'gui-types',
      'sections' => 'gui-sections',
      'modules' => 'gui-modules',
      'fields' => 'gui-fields?section=new',
      'section' => 'gui-scalar?value=section',
      'title' => 'gui-scalar?value=',
      'page-title' => 'gui-scalar?value=Добавить раздел',
      'alias' => 'gui-scalar?value=',
      'module' => 'gui-scalar?value=default'
    ],
    'template' => 'sections/configs/add.tmplt'
  ],
  '/cms/configs/{section}/' => [
    'data' => [
      'title' => 'gui-sections?section={section}&field=title',
      'page-title' => 'gui-scalar?value=Редактировать раздел «{title}»',
      'id' => 'gui-sections?section={section}&field=id',
      'alias' => 'gui-sections?section={section}&field=alias',
      'module' => 'gui-sections?section={section}&field=module',
      'fields' => 'gui-fields?section={section}',
      'section' => 'gui-scalar?value=configs',
      'types' => 'gui-types',
      'sections' => 'gui-sections',
      'modules' => 'gui-modules'
    ],
    'template' => 'sections/configs/add.tmplt'
  ],
  '/cms/types/{type}/{handle}/' => MODULES . 'GUI/sections/main/type',
  '/cms/profile/' => [
    'data' => [
      'sections' => 'gui-sections'
    ],
    'template' => 'sections/users/profile.tmplt'
  ],
  '/cms/users/' => [
    'data' => [
      'sections' => 'gui-sections',
      'section' => 'gui-scalar?value=users',
      'users' => 'gui-users',
      'invitations' => 'gui-users?invitations'
    ],
    'template' => 'sections/users/users.tmplt'
  ],
  '/cms/users/{id}/' => [
    'data' => [
      'sections' => 'gui-sections',
      'section' => 'gui-scalar?value=users',
      'edit-user' => 'gui-profile?id={id}'
    ],
    'template' => 'sections/users/user.tmplt'
  ],
  '/cms/{section}/' => [
    'data' => [
      'title' => 'gui-sections?section={section}&field=title',
      'page-title' => 'gui-scalar?value=Редактировать раздел «{title}»',
      'fields' => 'gui-fields?section={section}',
      'user-fields' => 'gui-fields?section={section}&usersonly',
      'section' => 'gui-scalar?value={section}',
      'sections' => 'gui-sections',
      'data' => 'gui-item-list?section={section}&status=public,draft',
      'pages' => 'gui-pages?section={section}&status=public,draft',
      'page' => 'gui-scalar?value=1'
    ],
    'template' => 'sections/item/index.tmplt'
  ],
  '/cms/{section}/page/{page}/' => [
    'data' => [
      'title' => 'gui-sections?section={section}&field=title',
      'page-title' => 'gui-scalar?value=Редактировать раздел «{title}»',
      'fields' => 'gui-fields?section={section}',
      'user-fields' => 'gui-fields?section={section}&usersonly',
      'section' => 'gui-scalar?value={section}',
      'sections' => 'gui-sections',
      'data' => 'gui-item-list?section={section}&page={page}&status=public,draft',
      'pages' => 'gui-pages?section={section}&status=public,draft',
      'page' => 'gui-scalar?value={page}'
    ],
    'template' => 'sections/item/index.tmplt'
  ],
  '/cms/{section}/page/{page}/limit/{limit}/' => [
    'data' => [
      'title' => 'gui-sections?section={section}&field=title',
      'page-title' => 'gui-scalar?value=Редактировать раздел «{title}»',
      'fields' => 'gui-fields?section={section}',
      'user-fields' => 'gui-fields?section={section}&usersonly',
      'section' => 'gui-scalar?value={section}',
      'sections' => 'gui-sections',
      'data' => 'gui-item-list?section={section}&page={page}&limit={limit}&status=public,draft',
      'pages' => 'gui-pages?section={section}&limit={limit}&status=public,draft',
      'page' => 'gui-scalar?value={page}'
    ],
    'template' => 'sections/item/index.tmplt'
  ],
  '/cms/{section}/add/' => [
    'data' => [
      'sections' => 'gui-sections',
      'fields' => 'gui-fields?section={section}',
      'section' => 'gui-sections?section={section}&field=alias',
      'section-name' => 'gui-sections?section={section}&field=title',
      'page-title' => 'gui-scalar?value=Добавить запись в «{section-name}»',
      'data' => 'gui-section-data?section={section}'
    ],
    'template' => 'sections/item/add.tmplt'
  ],
  '/cms/{section}/action_save/' => MODULES . 'GUI/sections/item/action_save',
  '/cms/{section}/action_delete/' => MODULES . 'GUI/sections/item/action_delete',
  '/cms/{section}/{id}/' => [
    'data' => [
      'sections' => 'gui-sections',
      'fields' => 'gui-fields?section={section}',
      'section' => 'gui-sections?section={section}&field=alias',
      'section-name' => 'gui-sections?section={section}&field=title',
      'page-title' => 'gui-scalar?value=Добавить запись в «{section-name}»',
      'data' => 'gui-section-data?section={section}&id={id}'
    ],
    'template' => 'sections/item/add.tmplt'
  ]
];
