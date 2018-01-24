<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

return [
  '/cms/' => MODULES . 'GUI/sections/main/index',
  '/cms/configs/' => [
    'data' => [
      'page-title' => 'gui-scalar?value=помойки',
      'collection' => 'gui-scalar?value=configs',
      'collections' => 'gui-collections',
      'modules' => 'gui-modules'
    ],
    'template' => 'entries/configs.gutt'
  ],
  '/cms/configs/add/' => [
    'data' => [
      'types' => 'gui-types',
      'collections' => 'gui-collections',
      'fields' => 'gui-fields?collection=new',
      'collection' => 'gui-scalar?value=section',
      'page-title' => 'gui-scalar?value=Добавить раздел',
      'page' => [
        'title' => 'gui-scalar?value=',
        'alias' => 'gui-scalar?value='
      ],
      'storages' => 'gui-storages'
    ],
    'template' => 'entries/configs-add.gutt'
  ],
  '/cms/configs/{configsCollection}/' => [
    'data' => [
      'types' => 'gui-types',
      'collections' => 'gui-collections',
      'fields' => 'gui-fields?collection={configsCollection}',
      'collection' => 'gui-scalar?value=configs',
      'page' => [
        'title' => 'gui-collections?collection={configsCollection}&field=title',
        'id' => 'gui-collections?collection={configsCollection}&field=id',
        'alias' => 'gui-collections?collection={configsCollection}&field=alias'
      ],
      'page-title' => 'gui-scalar?value=Редактировать раздел «{page.title}»',
      'storages' => 'gui-storages'
    ],
    'template' => 'entries/configs-add.gutt'
  ],
  '/cms/types/{type}/{handle}/' => MODULES . 'GUI/sections/main/type',
  '/cms/profile/' => [
    'data' => [
      'sections' => 'gui-collections'
    ],
    'template' => 'sections/users/profile.gutt'
  ],
  '/cms/users/' => [
    'data' => [
      'sections' => 'gui-collections',
      'section' => 'gui-scalar?value=users',
      'users' => 'gui-users',
      'invitations' => 'gui-users?invitations'
    ],
    'template' => 'sections/users/users.gutt'
  ],
  '/cms/users/{id}/' => [
    'data' => [
      'sections' => 'gui-collections',
      'section' => 'gui-scalar?value=users',
      'edit-user' => 'gui-profile?id={id}'
    ],
    'template' => 'sections/users/user.gutt'
  ],
  '/cms/{collection}/' => [
    'data' => [
      'title' => 'gui-collections?collection={collection}&field=title',
      'page-title' => 'gui-scalar?value=Редактировать раздел «{title}»',
      'fields' => 'gui-fields?collection={collection}',
      'user-fields' => 'gui-fields?collection={collection}&usersonly',
      'collection' => 'gui-scalar?value={collection}',
      'collections' => 'gui-collections',
      'data' => 'gui-item-list?collection={collection}&status=public,draft',
      'pages' => 'gui-pages?collection={collection}&status=public,draft',
      'page' => 'gui-scalar?value=1'
    ],
    'template' => 'sections/item/index.gutt'
  ],
  '/cms/{collection}/page/{page}/' => [
    'data' => [
      'title' => 'gui-collections?section={collection}&field=title',
      'page-title' => 'gui-scalar?value=Редактировать раздел «{title}»',
      'fields' => 'gui-fields?section={collection}',
      'user-fields' => 'gui-fields?section={collection}&usersonly',
      'section' => 'gui-scalar?value={collection}',
      'sections' => 'gui-collections',
      'data' => 'gui-item-list?section={collection}&page={page}&status=public,draft',
      'pages' => 'gui-pages?section={collection}&status=public,draft',
      'page' => 'gui-scalar?value={page}'
    ],
    'template' => 'sections/item/index.gutt'
  ],
  '/cms/{collection}/page/{page}/limit/{limit}/' => [
    'data' => [
      'title' => 'gui-collections?section={collection}&field=title',
      'page-title' => 'gui-scalar?value=Редактировать раздел «{title}»',
      'fields' => 'gui-fields?section={collection}',
      'user-fields' => 'gui-fields?section={collection}&usersonly',
      'section' => 'gui-scalar?value={collection}',
      'sections' => 'gui-collections',
      'data' => 'gui-item-list?section={collection}&page={page}&limit={limit}&status=public,draft',
      'pages' => 'gui-pages?section={collection}&limit={limit}&status=public,draft',
      'page' => 'gui-scalar?value={page}'
    ],
    'template' => 'sections/item/index.gutt'
  ],
  '/cms/{collection}/add/' => [
    'data' => [
      'sections' => 'gui-collections',
      'fields' => 'gui-fields?section={collection}',
      'section' => 'gui-collections?section={collection}&field=alias',
      'section-name' => 'gui-collections?section={collection}&field=title',
      'page-title' => 'gui-scalar?value=Добавить запись в «{section-name}»',
      'data' => 'gui-collection-data?section={collection}'
    ],
    'template' => 'sections/item/add.gutt'
  ],
  '/cms/{collection}/action_save/' => MODULES . 'GUI/sections/item/action_save',
  '/cms/{collection}/action_delete/' => MODULES . 'GUI/sections/item/action_delete',
  '/cms/{collection}/{id}/' => [
    'data' => [
      'sections' => 'gui-collections',
      'fields' => 'gui-fields?section={collection}',
      'section' => 'gui-collections?section={collection}&field=alias',
      'section-name' => 'gui-collections?section={collection}&field=title',
      'page-title' => 'gui-scalar?value=Добавить запись в «{section-name}»',
      'data' => 'gui-collection-data?section={collection}&id={id}'
    ],
    'template' => 'sections/item/add.gutt'
  ]
];
