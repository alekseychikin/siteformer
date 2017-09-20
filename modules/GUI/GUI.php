<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

require_once __DIR__ . '/GUIGetItemList.php';
require_once __DIR__ . '/GUIGetItem.php';

class SFGUI
{
  private static $collections = [];

  public static function init($params = []) {
    $dependencies = ['SFRouter', 'SFERM', 'SFTemplater'];
    arrMap($dependencies, function ($dependence) {
      if (!class_exists($dependence)) die('Need module Router before '. $dependence);
    });

    self::checkTables();

    echo "lalala";
    die();

    SFModels::registerPath(MODULES . 'GUI/models');

    $routes = include __DIR__ . '/routes.php';

    foreach ($routes as $path => $data) {
      SFRouter::addRule($path, $data);
    }

    if (SFURI::getFirstUri() === 'cms') {
      SFTemplater::setCompilesPath(ENGINE . 'modules/GUI/dist/');

      if (SFURI::getUri(1) !== 'types') {
        self::login();
      }
    }
  }

  public static function getNewFields () {
    $types = SFERM::getTypes();
    list($index, $firstType) = each($types);
    reset($types);

    foreach ($types as $type) {
      if ($type['type'] === 'string') {
        $firstType = $type;
      }
    }

    $fields = [
      [
        'title' => '',
        'alias' => '',
        'type' => $firstType['type'],
        'settings' => $firstType['defaultSettings'],
        'position' => 0,
        'required' => false
      ]
    ];

    return $fields;
  }

  private static function checkTables() {
    if (!SFORM::exists('sys_collection_fields_users')) {
      SFORM::create('sys_collection_fields_users')
        ->addField([
          'name' => 'user',
          'type' => 'INT(11) UNSIGNED',
          'autoincrement' => true,
          'null' => false
        ])
        ->addField([
          'name' => 'collection',
          'type' => 'INT(11) UNSIGNED',
          'null' => false
        ])
        ->addField([
          'name' => 'field',
          'type' => 'INT(11) UNSIGNED',
          'null' => false
        ])
        ->addKey(['user', 'collection', 'field'], 'primary key')
        ->addKey(['user', 'collection'])
        ->exec();
    }

    if (!SFORM::exists('sys_users')) {
      SFORM::create('sys_users')
      ->addField([
        'name' => 'id',
        'type' => 'INT(4) UNSIGNED',
        'autoincrement' => true,
        'null' => false
      ])
      ->addField([
        'name' => 'login',
        'type' => 'VARCHAR(100)',
        'null' => false
      ])
      ->addField([
        'name' => 'password',
        'type' => 'VARCHAR(32)',
        'null' => false
      ])
      ->addField([
        'name' => 'role',
        'type' => 'ENUM("admin","user")',
        'default' => "user"
      ])
      ->addField([
        'name' => 'userpic',
        'type' => 'VARCHAR(200)',
        'null' => true,
        'default' => null
      ])
      ->addKey('id', 'primary key')
      ->addKey(['login', 'password'], 'key')
      ->exec();
    }

    if (!SFORM::exists('sys_user_invitations')) {
      SFORM::create('sys_user_invitations')
      ->addField([
        'name' => 'hash',
        'type' => 'VARCHAR(32)',
        'null' => false
      ])
      ->addField([
        'name' => 'email',
        'type' => 'VARCHAR(200)',
        'null' => false
      ])
      ->addKey('hash', 'primary key')
      ->exec();
    }
  }

  public static function login() {
    $auth = false;
    $doLogin = false;

    if (isset($_SESSION['cms_login']) && isset($_SESSION['cms_password'])) {
      $login = $_SESSION['cms_login'];
      $password = $_SESSION['cms_password'];
      $doLogin = true;
    }

    if (isset($_POST['login']) && isset($_POST['password']) && isset($_POST['login_submit'])) {
      $login = $_POST['login'];
      $password = md5($_POST['password']);
      $doLogin = true;
    }

    if ($doLogin) {
      $user = SFORM::select()
      ->from('sys_users')
      ->where('login', $login)
      ->andWhere('password', $password)
      ->exec();

      if (!count($user)) {
        throw new ValidateException([
          'code' => 'EWRONGAUTH'
        ]);
      }

      $_SESSION['cms_login'] = $login;
      $_SESSION['cms_password'] = $password;

      $auth = true;

      $user[0]['password'] = '';
      SFResponse::set('user', $user[0]);
    }

    if (!$auth) {
      if (isset($_GET['invitation'])) {
        $user = SFORM::select()
        ->from('sys_user_invitations')
        ->where('hash', $_GET['invitation'])
        ->execOne();

        if (count($user)) {
          SFResponse::set('page-title', 'Создать профиль');
          SFResponse::set('email', $user['email']);
          SFResponse::set('hash', $_GET['invitation']);
          echo SFTemplater::render('sections/users/invitation.tmplt', SFResponse::getState());
          SFResponse::render();
        } else {
        }
      }

      $users = SFORM::select()
      ->from('sys_users')
      ->exec();

      $users = arrMap($users, function ($user) {
        $user['password'] = '';

        return $user;
      });

      SFResponse::set('users', $users);

      SFResponse::set('page-title', 'Авторизация');
      echo SFTemplater::render('sections/main/login.tmplt', SFResponse::getState());
      SFResponse::render();
    }
  }
}
