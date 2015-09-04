<?

  class SFSocketConnect
  {
    private $connect = false;
    private $host;
    private $uri;

    public function __construct($host, $port = 80)
    {
      if (strpos($host, '://') !== false) {
        $host = substr($host, strpos($host, '://') + 3);
      }
      if (strpos($host, '/') !== false) {
        $uri = substr($host, strpos($host, '/'));
        $host = substr($host, 0, strpos($host, '/'));
      }
      else {
        $uri = '/';
      }
      $this->host = $host;
      $this->uri = $uri;

      $connect = fsockopen($this->host, $port, $errno, $errstr, 30);
      if ($connect) {
        $this->connect = $connect;
      }
      else {
        echo "$errstr ($errno)<br />\n";
      }
    }

    public function post($params)
    {
      if ($this->connect) {
        $postValues = '';
        foreach ($params as $name => $value ){
          $postValues .= urlencode($name).'='.urlencode($value).'&';
        }
        $postValues = substr($postValues, 0, -1);
        $request  = 'POST '.$this->uri.' HTTP/1.1'."\r\n";
        $request .= 'Host: '.$this->host."\r\n";
        $request .= "Connection: Close\r\n";

        $lenght = strlen($postValues);
        $request .= "Content-Type: application/x-www-form-urlencoded\r\n";
        $request .= "Content-Length: $lenght\r\n";
        $request .= "\r\n";
        $request .= $postValues;

        fwrite($this->connect, $request);
        $ret = '';
        while (!feof($this->connect)) {
          $ret .= fgets($this->connect);
        }
        return new socketResult($ret);
      }
      else {
        echo 'no connection';
      }
    }

    public function get($params = array())
    {
      if ($this->connect) {
        $postValues = '';
        foreach ($params as $name => $value ){
          $postValues .= urlencode($name).'='.urlencode($value).'&';
        }
        $postValues = substr($postValues, 0, -1);
        $request  = 'GET '.$this->uri.(!empty($postValues) ? '?'.$postValues : '').' HTTP/1.1'."\r\n";
        $request .= 'Host: '.$this->host."\r\n";
        $request .= "Connection: Close\r\n";
        $request .= "\r\n";

        fwrite($this->connect, $request);
        $ret = '';
        while (!feof($this->connect)) {
          $ret .= fgets($this->connect);
        }
        return new socketResult($ret);
      }
      else {
        echo 'no connection';
      }
    }
  }

  class socketResult
  {
    private $result;

    public function __construct($result)
    {
      $this->result = $result;
    }

    public function content()
    {
      $content = $this->result;
      if (strpos($content, "\r\n\r\n") !== false) {
        $content = substr($content, strpos($content, "\r\n\r\n"));
        $content = ltrim($content);
      }
      elseif (strpos($content, "\n\n") !== false) {
        $content = substr($content, strpos($content, "\n\n"));
        $content = ltrim($content);
      }
      return $content;
    }

    public function header()
    {
      $content = $this->result;
      if (strpos($content, "\r\n\r\n") !== false) {
        $content = substr($content, 0, strpos($content, "\r\n\r\n"));
        $content = ltrim($content);
      }
      elseif (strpos($content, "\n\n") !== false) {
        $content = substr($content, 0, strpos($content, "\n\n"));
        $content = ltrim($content);
      }
      return $content;
    }

    public function plain()
    {
      return $this->result;
    }
  }


?>
