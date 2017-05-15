<? if (!defined('ROOT')) die('You can\'t just open this file, dude');

class SFMail
{
  private $destinations = array();
  private $addresser = '';
  private $addresser_mail = 'admin@localhost';
  private $content = '';
  private $attaches = array();
  private $subject = '(Без темы)';

  public static function factory() {
    return new SFMail();
  }

  public function destination($mail) // Добавить адресата
  {
    if (!in_array($mail, $this->destinations)) {
      $this->destinations[] = $mail;
    }
    return $this;
  }

  public function subject($subject) // Установить тему
  {
    $this->subject = $subject;
    return $this;
  }

  public function addresser($addresser, $mail) // Установить отправителя
  {
    $this->addresser = $addresser;
    $this->addresser_mail = $mail;
    return $this;
  }

  public function content($content) // Установить содержание
  {
    $this->content = $content;
    return $this;
  }

  public function attacheFile($file_path) // Прикрепить файл
  {
    if (!in_array($file_path, $this->attaches)) {
      if (file_exists($file_path)) {
        $this->attaches[] = $file_path;
        return (count($this->attaches) - 1);
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  private static function code($string)
  {
    return '=?UTF-8?B?'.base64_encode($string).'?=';
  }

  public function send() // Отправить
  {
    $mime_array = array('png'  => 'image/png',
                        'gif'  => 'image/gif',
                        'jpg'  => 'image/jpeg',
                        'jpeg' => 'image/jpeg',
                        'rar'  => 'application/x-rar-compressed',
                        'zip'  => 'application/x-zip-compressed',
                        'pdf'  => 'application/pdf',
                        );
    $destinations = implode(', ', $this->destinations);
    $semi_rand = md5(time());
    $mime_boundary = md5(time());
    $headers = 'From: '.self::code($this->addresser).' <'.$this->addresser_mail.'>'."\n";
    $headers .= 'MIME-Version: 1.0'."\n";
    if (count($this->attaches) == 0) {
      $headers .= 'Content-Type: text/html; charset=utf-8'."\n";
      if (@mail($destinations, $this->subject, $this->content, $headers)){
        return true;
      }
      else {
        return false;
      }
    }
    else {
      $headers .= 'Content-Type: multipart/mixed; boundary='.$mime_boundary."\n\n";
      $message  = '--'.$mime_boundary."\n";
      $message .= 'Content-Type: text/html; charset=utf-8'."\n";
      $message .= 'Content-Transfer-Encoding: 8bit'."\n\n";
      $message .= $this->content."\n\n";
      foreach ($this->attaches as $file) {
        $message .= '--'.$mime_boundary."\n";
        $fp = @fopen($file, 'rb');
        $data = @fread($fp, filesize($file));
        $data = chunk_split(base64_encode($data));
        $message .= 'Content-Type: image/png; name="'.basename($file).'"'."\n";
        $message .= 'Content-Description: '.basename($file)."\n";
        $message .= 'Content-Disposition: attachment;'."\n".' filename="'.basename($file).'"; size='.filesize($file).';'."\n";
        $message .= 'Content-Transfer-Encoding: base64'."\n\n".$data."\n\n";
      }
      $message .= '--'.$mime_boundary.'--'."\n\n";
      if (@mail($destinations, $this->subject, $message, $headers)){
        return true;
      }
      else {
        return false;
      }
    }
  }
}
