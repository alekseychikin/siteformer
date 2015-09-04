<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  class SFReactData
  {
    private static $results = array();

    public static function init()
    {
      if (class_exists('SFRouter')) {
        SFRouter::addRule('/__reactdata/', MODULES.'ReactData/action', true);
      }
    }

    public static function register($type, $event, $params = '', $base = 'default')
    {
      self::set($type, $event, $params, $base);
      self::checkData();
    }

    public static function set($type, $event, $params = '', $base = 'default')
    {
      SFORM::insert('__events')
        ->values(array('type' => $type, 'event' => $event, 'params' => serialize($params)))
        ->execute($base);
    }

    public static function checkData($base = 'default')
    {
      SFResponse::setType('__json');
      if (!isset($_POST['__actions'])) return;
      if (!isset($_POST['__last_event'])) return;
      $lastEvent = (int) $_POST['__last_event'];

      $result = array();
      $starttime = round(microtime(true), 2);
      $limitSeconds = 24;
      session_destroy();
      while (true) {
        $data = SFORM::select('id_event', 'type', 'event', 'params')
          ->from('__events')
          ->where(_expr_('id_event', '>', $lastEvent))
          ->execute($base);
        if (count($data)) {
          ob_start();
          foreach ($_POST['__actions'] as $action) {
            $params = array();
            if (isset($_POST['__params'][$action])) {
              $params = $_POST['__params'][$action];
            }
            $data = SFResponse::run(substr($action, 1, -1), $params);
            $result[$action] = $data;
          }
          ob_end_clean();
          // echo 'qwe';
          break;
        }
        usleep(50000);
        if ((round(microtime(true), 2) - $starttime) > $limitSeconds) {
          break;
        }
      }

      SFResponse::set('result', $result);
      $result = SFORM::select('id_event')->from('__events')->order('id_event DESC')->limit(1)->execute($base);
      $lastState = 0;
      if (count($result)) {
        list($key, $row) = each($result);
        $lastState = $row['id_event'];
      }
      SFResponse::set('_getLastState', $lastState);
      SFResponse::render();
    }

    public static function prepare($type, $callback, $base = 'default')
    {
      if (!isset($_POST['__last_event'])) return;
      $lastEvent = (int) $_POST['__last_event'];
      // $lastEvent = 0;
      $result = array();
      // $starttime = round(microtime(true), 2);
      // $limitSeconds = 24;
      // session_destroy();
      // while (true) {
      SFORM::showError();
        $data = SFORM::select('id_event', 'type', 'event', 'params')
          ->from('__events')
          ->where(_and_(_expr_('id_event', '>', $lastEvent), _expr_('type', '=', $type)))
          ->execute($base);
        if (count($data)) {
          foreach ($data as $item) {
            if (!isset($result[$item['event']])) {
              $result[$item['event']] = array();
            }
            $params = unserialize($item['params']);
            $result[$item['event']][] = array('params' => $params, 'data' => $callback($params));
          }
          // break;
        }
        // usleep(50000);
        // if ((round(microtime(true), 2) - $starttime) > $limitSeconds) {
          // break;
        // }
      // }
      return $result;
    }

    public static function setResult($result)
    {
      self::$results = $result;
    }

    public static function get($type)
    {
      return $data;
    }
  }
