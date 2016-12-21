<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiItemList extends SFRouterModel
{
  public static function get ($params) {
    $statuses = ['active'];

    if (isset($params['status'])) {
      $statuses = explode(',', $params['status']);

      $statuses = arrMap($statuses, function ($status) {
        return trim($status);
      });
    }

    $result = SFGUI::getItemList($params['section'])
      ->where('status', $statuses)
      ->order('id desc')
      ->limit(0, 10);

    $query = $result->getQuery();

    return $result->exec();
  }
}
