<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiProfile extends SFRouterModel
{
  public static function get ($params) {
    $user = SFORM::select()
    ->from('sys_users')
    ->where('id', $params['id'])
    ->execOne();

    $user['password'] = '';

    return $user;
  }

  public static function post ($params) {
    if (isset($params['create-account'])) {
      self::createAccount($params);
    } elseif (isset($params["delete-profile"])) {
      self::deleteProfile($params["delete-profile"]);
    } elseif (isset($params["save-profile"])) {
      self::saveProfile($params);
    } else {
      self::updateProfile($params);
    }
  }

  private static function deleteProfile ($id) {
    SFGUI::login();

    $user = SFResponse::get('user');

    if ($user['role'] == 'admin') {
      SFORM::delete('sys_users')
      ->where('id', $id)
      ->exec();
    }
  }

  private static function saveProfile ($params) {
    $login = $params['login'];

    $userData = SFValidate::value([
      'email' => [
        'required' => true,
        'type' => 'email'
      ],
      'role' => [
        'values' => ['user', 'admin'],
        'required' => true
      ]
    ], $params);

    SFORM::update('sys_users')
    ->values($userData)
    ->where('login', $login)
    ->exec();
  }

  private static function createAccount ($params) {
    $invitationRecord = SFORM::select()
    ->from('sys_user_invitations')
    ->where('hash', $params['hash'])
    ->execOne();

    if (count($invitationRecord)) {
      $userData = SFValidate::value(
        [
          'userpic' => [],
          'login' => [
            'unique' => function ($value) {
              return !strlen($value) || !SFORM::select()
                ->from('sys_users')
                ->where('login', $value)
                ->length();
            },
            'required' => true
          ],
          'password' => [
            'required' => true,
            'modify' => function ($value) {
              return md5($value);
            }
          ]
        ],
        $params
      );

      $userData['userpic'] = self::prepareUserpic($params);

      $userData['email'] = $invitationRecord['email'];

      SFORM::insert('sys_users')
      ->values($userData)
      ->exec();

      SFORM::delete('sys_user_invitations')
      ->where('hash', $params['hash'])
      ->exec();

      $_SESSION['cms_login'] = $userData['login'];
      $_SESSION['cms_password'] = $userData['password'];
    }
  }

  private static function updateProfile ($params) {
    SFGUI::login();

    $user = SFResponse::get('user');

    $userData = SFValidate::value(
      [
        'userpic' => [],
        'email' => [
          'unique' => function ($value) use ($user) {
            return !strlen($value) || !SFORM::select()
              ->from('sys_users')
              ->where('email', $value)
              ->andWhere('id', '!=', $user['id'])
              ->length();
          }
        ]
      ],
      $params
    );

    if (isset($params['password']) && strlen($params['password'])) {
      $userData['password'] = md5($params['password']);
      $_SESSION['cms_password'] = $userData['password'];
    }

    $userData['userpic'] = self::prepareUserpic($params);

    SFORM::update('sys_users')
    ->values($userData)
    ->where('id', $user['id'])
    ->exec();
  }

  private static function prepareUserpic ($params) {
    $userpic = null;

    if (!empty($params['userpic'])) {
      $imageSize = getimagesize(ENGINE_TEMP . $params['userpic']);
      $resizeParams = [];

      if ($imageSize[0] > $imageSize[1]) {
        $resizeParams['height'] = 80;
      } else {
        $resizeParams['width'] = 80;
      }

      $image = new SFImage(ENGINE_TEMP . $params['userpic']);
      $fieldTempPath = $image->path('filepath') . 'profile_userpic_' . $image->path('filename');
      $image = $image->resize($resizeParams, $fieldTempPath)
      ->crop([
        'width' => 80,
        'height' => 80,
        'position' => 'top center'
      ]);

      $path = SFPath::prepareDir('userpics', PPD_OPEN_LEFT | PPD_CLOSE_RIGHT);

      $userpic = '/sf-engine' . substr(SFPath::move(ENGINE . $path, $fieldTempPath), strlen(ENGINE) - 1);
    }

    return $userpic;
  }
}
