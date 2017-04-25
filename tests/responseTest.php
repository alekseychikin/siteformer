<?php

if (!defined('ROOT')) {
  define('ROOT', __DIR__ . '/../');
}

session_start();

require_once ROOT . 'classes/response.php';

class ResponseTest extends PHPUnit_Framework_TestCase
{
  public function testSetValue() {
    $this->assertEquals('', SFResponse::get('name'));
    SFResponse::set('name', 'testname');
    $this->assertEquals('testname', SFResponse::get('name'));

    $this->assertEquals('', SFResponse::get('items'));
    SFResponse::set('items', [1, 2, 3, 4, 5]);
    $this->assertEquals([1, 2, 3, 4, 5], SFResponse::get('items'));
  }

  public function testExistsAction() {
    $this->assertEquals(false, SFResponse::actionExists('action'));
    $this->assertEquals(false, SFResponse::actionExists('action/index'));
    $this->assertEquals(false, SFResponse::actionExists('action/'));
    $this->assertEquals(false, SFResponse::actionExists('action/index/'));
    $this->assertEquals(false, SFResponse::actionExists('action.php'));
    $this->assertEquals(false, SFResponse::actionExists('action/index.php'));

    $this->assertEquals(false, SFResponse::actionExists('/action'));
    $this->assertEquals(false, SFResponse::actionExists('/action/index'));
    $this->assertEquals(false, SFResponse::actionExists('/action/'));
    $this->assertEquals(false, SFResponse::actionExists('/action/index/'));
    $this->assertEquals(false, SFResponse::actionExists('/action.php'));
    $this->assertEquals(false, SFResponse::actionExists('/action/index.php'));

    $this->assertEquals(true, SFResponse::actionExists(ROOT . 'tests/action'));
    $this->assertEquals(true, SFResponse::actionExists(ROOT . 'tests/action/index'));
    $this->assertEquals(false, SFResponse::actionExists(ROOT . 'tests/action.php'));
    $this->assertEquals(true, SFResponse::actionExists(ROOT . 'tests/action/index.php'));
    $this->assertEquals(true, SFResponse::actionExists(ROOT . 'tests/action/'));
    $this->assertEquals(false, SFResponse::actionExists(ROOT . 'tests/action/index/'));

    $this->assertEquals(true, SFResponse::actionExists('tests/action'));
    $this->assertEquals(true, SFResponse::actionExists('tests/action/index'));
    $this->assertEquals(true, SFResponse::actionExists('tests/action/'));
    $this->assertEquals(false, SFResponse::actionExists('tests/action/index/'));
    $this->assertEquals(false, SFResponse::actionExists('tests/action.php'));
    $this->assertEquals(true, SFResponse::actionExists('tests/action/index.php'));
  }

  public function testGetState() {
    $this->assertEquals(['name' => 'testname', 'items' => [1, 2, 3, 4, 5]], SFResponse::getState());
  }

  public function testInitRedirData() {
    $this->assertEquals([
      'name' => 'testname',
      'items' => [1, 2, 3, 4, 5]
    ], SFResponse::getState());

    $_SESSION['redir_data'] = ['redir_variable' => 'redir value'];

    $this->assertEquals([
      'name' => 'testname',
      'items' => [1, 2, 3, 4, 5]
    ], SFResponse::getState());

    SFResponse::initRedirData();

    $this->assertEquals([
      'name' => 'testname',
      'items' => [1, 2, 3, 4, 5],
      'redir_variable' => 'redir value'
    ], SFResponse::getState());

    $this->assertEquals(false, isset($_SESSION['redir_data']));
  }
}
