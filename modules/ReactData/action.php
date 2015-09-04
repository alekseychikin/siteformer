<?php if (!defined('ROOT')) die('You can\'t just open this file, dude');

  if (isset($_POST['get_last_event'])) {
    $result = SFORM::select('id_event')->from('__events')->order('id_event DESC')->limit(1)->executeOne();
    if (count($result)) {
      die(json_encode(array('_getLastState' => $result['id_event'])));
    }
    else {
      die(json_encode(array('_getLastState' => 0)));
    }
  }

  if (isset($_POST['check_data'])) {
    SFReactData::checkData();
  }

?>
