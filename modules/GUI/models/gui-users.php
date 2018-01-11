<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiUsers extends SFRouterModel
{
  public static function get ($params) {
    SFGUI::login();

    if (isset($params['invitations'])) {
      return SFORM::select()
      ->from('sys_user_invitations')
      ->exec();
    } else {
      $users = SFORM::select()
      ->from('sys_users')
      ->order('id desc')
      ->exec();

      return arrMap($users, function ($user) {
        unset($user['password']);

        return $user;
      });
    }
  }

  public static function post ($params) {
    $email = SFValidate::value([
      'type' => 'email',
      'required' => true
    ], $params['email']);

    if (isset($params['send-invitation'])) {
      $hash = md5(time() . rand(0, 100000));
      $link = $_SERVER['HTTP_ORIGIN'] . '/cms/?invitation=' . $hash;

      SFORM::insert('sys_user_invitations')
      ->values([
        'hash' => $hash,
        'email' => $email
      ])
      ->exec();

      $content = <<<EOT
<h1>Приглашение в ряды редакторов</h1>

<p>Перейдите по ссылке и заполните анкету или проигнорируйте письмо, если понятия не имеете, о чем идет речь.</p>
<p><a href="{$link}">{$link}</a></p>
EOT;

      echo $content;
      $mail = SFMail::factory()
      ->destination($email)
      ->subject('Приглашение в ряды редакторов')
      ->addresser('Робот сайта', 'robot@localhost')
      ->content($content);
    } elseif (isset($params['delete-invitation'])) {
      SFORM::delete('sys_user_invitations')
      ->where('email', $email)
      ->exec();
    }
  }
}
