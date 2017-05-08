<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFGuiPages extends SFRouterModel
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

    $section = SFGUI::getSection($params['section']);

    $amountItems = SFORM::select([SFORM::func('COUNT(*)'), 'length'])
      ->dropIdFields()
      ->from($section['table']);

    foreach ($statuses as $index => $status) {
      if (!$index) {
        $amountItems->where('status', $status);

        continue;
      }

      $amountItems->orWhere('status', $status);
    }

    $amountItems = $amountItems->exec();
    $amountItems = $amountItems[0]['length'];

    $pages = (int) $amountItems / $params['limit'];

    return $pages + ($amountItems % $params['limit'] > 0 ? 1 : 0);
  }
}
