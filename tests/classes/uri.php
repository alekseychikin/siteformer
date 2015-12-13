<?php

  define('ROOT', __DIR__.'/../../');
  require_once __DIR__.'/../../classes/uri.php';

  class SFURITest extends PHPUnit_Framework_TestCase
  {
    public function testEmpty()
    {
      SFURI::init('');

      $this->assertEquals('/', SFURI::getUri());
      $this->assertEquals('/', SFURI::getUri(0));
      $this->assertEquals(false, SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('/'), SFURI::getUriRaw());
      $this->assertEquals('/', SFURI::getLastUri());
      $this->assertEquals('/', SFURI::getFirstUri());
      $this->assertEquals(1, SFURI::getUriLength());
    }

    public function testRoot()
    {
      SFURI::init('/');

      $this->assertEquals('/', SFURI::getUri());
      $this->assertEquals('/', SFURI::getUri(0));
      $this->assertEquals(false, SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('/'), SFURI::getUriRaw());
      $this->assertEquals('/', SFURI::getLastUri());
      $this->assertEquals('/', SFURI::getFirstUri());
      $this->assertEquals(1, SFURI::getUriLength());
    }

    public function testOneFolderOpenRight()
    {
      SFURI::init('/one-dir');

      $this->assertEquals('one-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals(false, SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('one-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getLastUri());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals(1, SFURI::getUriLength());
    }

    public function testOneFolderOpenLeft()
    {
      SFURI::init('one-dir/');

      $this->assertEquals('one-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals(false, SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('one-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getLastUri());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals(1, SFURI::getUriLength());
    }

    public function testOneFolderOpen()
    {
      SFURI::init('one-dir');

      $this->assertEquals('one-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals(false, SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('one-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getLastUri());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals(1, SFURI::getUriLength());
    }

    public function testOneFolderClose()
    {
      SFURI::init('/one-dir/');

      $this->assertEquals('one-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals(false, SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('one-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getLastUri());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals(1, SFURI::getUriLength());
    }

    public function testTwoFolderOpenRight()
    {
      SFURI::init('/one-dir/two-dir');

      $this->assertEquals('one-dir/two-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals('two-dir', SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('one-dir', 'two-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals('two-dir', SFURI::getLastUri());
      $this->assertEquals(2, SFURI::getUriLength());
    }

    public function testTwoFolderOpenLeft()
    {
      SFURI::init('one-dir/two-dir/');

      $this->assertEquals('one-dir/two-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals('two-dir', SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('one-dir', 'two-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals('two-dir', SFURI::getLastUri());
      $this->assertEquals(2, SFURI::getUriLength());
    }

    public function testTwoFolderOpen()
    {
      SFURI::init('one-dir/two-dir');

      $this->assertEquals('one-dir/two-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals('two-dir', SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('one-dir', 'two-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals('two-dir', SFURI::getLastUri());
      $this->assertEquals(2, SFURI::getUriLength());
    }

    public function testTwoFolderClose()
    {
      SFURI::init('/one-dir/two-dir/');

      $this->assertEquals('one-dir/two-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals('two-dir', SFURI::getUri(1));
      $this->assertEquals(false, SFURI::getUri(2));
      $this->assertEquals(array('one-dir', 'two-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals('two-dir', SFURI::getLastUri());
      $this->assertEquals(2, SFURI::getUriLength());
    }

    public function testThreeFolderOpenLeft()
    {
      SFURI::init('one-dir/two-dir/three-dir/');

      $this->assertEquals('one-dir/two-dir/three-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals('two-dir', SFURI::getUri(1));
      $this->assertEquals('three-dir', SFURI::getUri(2));
      $this->assertEquals(false, SFURI::getUri(3));
      $this->assertEquals(array('one-dir', 'two-dir', 'three-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals('three-dir', SFURI::getLastUri());
      $this->assertEquals(3, SFURI::getUriLength());
    }

    public function testThreeFolderOpenRight()
    {
      SFURI::init('/one-dir/two-dir/three-dir');

      $this->assertEquals('one-dir/two-dir/three-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals('two-dir', SFURI::getUri(1));
      $this->assertEquals('three-dir', SFURI::getUri(2));
      $this->assertEquals(false, SFURI::getUri(3));
      $this->assertEquals(array('one-dir', 'two-dir', 'three-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals('three-dir', SFURI::getLastUri());
      $this->assertEquals(3, SFURI::getUriLength());
    }

    public function testThreeFolderOpen()
    {
      SFURI::init('one-dir/two-dir/three-dir');

      $this->assertEquals('one-dir/two-dir/three-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals('two-dir', SFURI::getUri(1));
      $this->assertEquals('three-dir', SFURI::getUri(2));
      $this->assertEquals(false, SFURI::getUri(3));
      $this->assertEquals(array('one-dir', 'two-dir', 'three-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals('three-dir', SFURI::getLastUri());
      $this->assertEquals(3, SFURI::getUriLength());
    }

    public function testThreeFolderClose()
    {
      SFURI::init('/one-dir/two-dir/three-dir/');

      $this->assertEquals('one-dir/two-dir/three-dir', SFURI::getUri());
      $this->assertEquals('one-dir', SFURI::getUri(0));
      $this->assertEquals('two-dir', SFURI::getUri(1));
      $this->assertEquals('three-dir', SFURI::getUri(2));
      $this->assertEquals(false, SFURI::getUri(3));
      $this->assertEquals(array('one-dir', 'two-dir', 'three-dir'), SFURI::getUriRaw());
      $this->assertEquals('one-dir', SFURI::getFirstUri());
      $this->assertEquals('three-dir', SFURI::getLastUri());
      $this->assertEquals(3, SFURI::getUriLength());
    }

    public function testOneDomain()
    {
      SFURI::init('/one-dir/two-dir/three-dir/', 'siteformer', 8080);
      $this->assertEquals('siteformer', SFURI::getDomain());
      $this->assertEquals('siteformer', SFURI::getDomain(0));
      $this->assertEquals(false, SFURI::getDomain(1));
      $this->assertEquals('siteformer', SFURI::getFirstDomain());
      $this->assertEquals('siteformer', SFURI::getLastDomain());
      $this->assertEquals(1, SFURI::getDomainsLength());
      $this->assertEquals(8080, SFURI::getPort());
    }

    public function testTwoDomain()
    {
      SFURI::init('/one-dir/two-dir/three-dir/', 'siteformer.dv', 8080);
      $this->assertEquals('siteformer.dv', SFURI::getDomain());
      $this->assertEquals('siteformer', SFURI::getDomain(0));
      $this->assertEquals('dv', SFURI::getDomain(1));
      $this->assertEquals(false, SFURI::getDomain(2));
      $this->assertEquals('siteformer', SFURI::getFirstDomain());
      $this->assertEquals('dv', SFURI::getLastDomain());
      $this->assertEquals(2, SFURI::getDomainsLength());
      $this->assertEquals(8080, SFURI::getPort());
    }
  }
