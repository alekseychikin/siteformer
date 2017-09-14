<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiItemList extends SFRouterModel
{
  public static function get ($params) {
    $statuses = ['public'];

    if (isset($params['status'])) {
      $statuses = explode(',', $params['status']);

      $statuses = arrMap($statuses, function ($status) {
        return trim($status);
      });
    }

    if (!isset($params['limit'])) {
      $params['limit'] = 10;
    }

    if (!isset($params['page'])) {
      $params['page'] = 1;
    }

    $offset = ($params['page'] - 1) * $params['limit'];

    $result = SFERM::getItemList($params['section'])
      ->where('status', $statuses)
      ->order('id desc')
      ->limit($offset, $params['limit']);

    $query = $result->getQuery();

    return $result->exec();
  }
}
