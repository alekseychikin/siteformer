<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiFields extends SFRouterModel
{
  public static function get ($params) {
    SFGUI::login();

    $user = SFResponse::get('user');

    if ($params['section'] === 'new') {
      return SFGUI::getNewFields();
    } else {
      $section = SFGUI::getSection($params['section']);

      if (isset($params['limit'])) {
        $fields = arrSort($section['fields'], function ($item1, $item2) {
          return $item1['position'] < $item2['position'];
        });

        return array_slice($fields, 0, $params['limit']);
      }

      if (isset($params['usersonly'])) {
        $fields = SFORM::select()
          ->from('sys_section_fields_users', 'user_fields')
          ->join('sys_section_fields', 'fields')
          ->on('fields.id', SFORM::field('user_fields.field'))
          ->where('user_fields.user', $user['id'])
          ->andWhere('user_fields.section', $section['id'])
          ->exec();

        $fields = arrMap($fields, function ($field) {
          return $field['fields'][0];
        });

        $fields = arrMap($fields, function ($field) {
          $field['settings'] = parseJSON($field['settings']);
          return $field;
        });

        return arrSort($fields, function ($item1, $item2) {
          return $item1['position'] < $item2['position'];
        });
      }

      return $section['fields'];
    }

    return false;
  }

  public static function post($params) {
    SFGUI::login();

    $user = SFResponse::get('user');

    if (isset($params['usersonly'])) {
      $section = SFGUI::getSection($params['section']);
      $fields = $params['fields'];

      SFORM::delete('sys_section_fields_users')
        ->where('section', $section['id'])
        ->exec();

      foreach ($fields as $field) {
        SFORM::insert('sys_section_fields_users')
          ->values([
            'section' => $section['id'],
            'user' => $user['id'],
            'field' => $field['id']
          ])
          ->exec();
      }
    }
  }
}
