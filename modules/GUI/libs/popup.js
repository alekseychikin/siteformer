var $ = require('jquery-plugins.coffee');
var initiatedElements = [];
var openned;
var $body = $(document.body);

$body.on('keydown', function (e)
{
  if (openned && e.keyCode === 27) {
    var node = $(e.target).get(0);
    if (node.nodeName.toLowerCase() === 'input') {
      node.blur();
    }
    else {
      Popup.close(openned);
    }
  }
});

$body.on('click', function ()
{
  if (openned) {
    Popup.close(openned);
  }
});

function initial(element)
{
  initiatedElements.push(element);
  var $element = $(element);
  $element.on('click', '.popup__close', function ()
  {
    Popup.close(element);
  });
  $element.on('click', '.popup__cancel', function ()
  {
    Popup.close(element);
  });
  $element.on('click', function (e)
  {
    e.stopPropagation();
  });
}

var Popup = {
  open: function (element)
  {
    var $element = $(element);
    var $wrap;
    if (openned) {
      $wrap = $(openned).parent();
      Popup.close(openned, false);
      $wrap.append($element);
    }
    else {
      $element.wrap('<div class="popup__wrap"></div>');
    }
    if (initiatedElements.indexOf(element) === -1) {
      initial(element);
    }
    setTimeout(function () {
      openned = element;
    }, 10);
    $wrap = $element.parent();
    setTimeout(function () {
      $element.addClass('popup--open');
      $wrap.addClass('popup__wrap--open');
      $element.find('input[type="text"], input[type="password"]').eq(0).focus();
      $body.addClass('g-fix');
    }, 0);
  },
  close: function (element, closeBack)
  {
    if (typeof element === 'undefined') {
      element = openned;
    }
    if (typeof closeBack !== 'boolean') {
      closeBack = true;
    }
    var $element = $(element);
    var $parent = $element.parent();
    $element.removeClass('popup--open');
    $element.trigger('popup-close');
    if (closeBack) {
      $parent.removeClass('popup__wrap--open');
      $body.removeClass('g-fix');
    }
    openned = null;
    setTimeout(function ()
    {
      if ($parent.hasClass('popup__wrap')) {
        $parent.after($element);
        if (closeBack) {
          $parent.remove();
        }
      }
    }, 250);
  }
};

$('[data-popup]').each(function () {
  var $item = $(this);
  $item.on('click', function () {
    Popup.open('#popup-' + $item.data('popup'));
  });
});

module.exports = Popup;
