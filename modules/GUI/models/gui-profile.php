<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiProfile extends SFRouterModel
{
  public static function post ($params) {
    SFGUI::login();

    $user = SFResponse::get('user');

    $userData = SFValidate::value(
      [
        'userpic' => [],
        'email' => [
          'unique' => function ($value) use ($user) {
            return !strlen($value) || !SFORM::select()
              ->from('users')
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

    if ($params['userpic'] === false) {
      $userData['userpic'] = null;
    } elseif (!empty($params['userpic']) && $params['userpic'] !== $user['userpic']) {
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

      $userData['userpic'] = '/sf-engine' . substr(SFPath::move(ENGINE . $path, $fieldTempPath), strlen(ENGINE) - 1);
    }

    SFORM::update('users')
    ->values($userData)
    ->where('id', $user['id'])
    ->exec();

    return '';
  }
}
