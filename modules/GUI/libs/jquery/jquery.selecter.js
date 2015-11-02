(function (factory)
{
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery', 'jquery.role'], factory);
  }
  else {
    // Browser globals
    factory(window.jQuery);
  }
})(function ($)
{
  var count = 1;
  var create = function ($select)
  {
    $select.data('selecter', true);
    var classes = $select.attr('class') ? $select.attr('class').split(' ') : [];
    classes.unshift('selecter');
    classes = classes.join(' ');
    $select.attr('class', '');
    $select.attr('readonly', true);
    var $inner = $('<span class="selecter__value" role="selecter-value"></span><span class="selecter__list" role="selecter-list"></span>');
    count++;
    $select.wrap('<span class="' + classes + '" />');
    var $label = $select.parent();
    $inner.insertAfter($select);
    var value = update($select);
    $label.find('@selecter-value').text(value);
    var $dropDown = $label.find('@selecter-list');
    var isShowing = false;
    var binded = false;
    var selectIndex = -1;
    var showSelect = function ()
    {
      if (!$select.attr('disabled')) {
        var windowHeight = $(window).height() + $(window).scrollTop();
        var offset = $label.offset().top;
        $('@selecter-list').not($dropDown).hide();
        $dropDown.show();
        if ($dropDown.height() > 380) {
          $dropDown.css({height: '380px'});
        }
        if (offset + $dropDown.height() + $label.height() > windowHeight) {
          if (offset - $dropDown.height() > 0) {
            $dropDown.addClass('selecter__list--bottom');
          }
          else {
            $dropDown.removeClass('selecter__list--bottom');
          }
        }
        isShowing = true;
      }
    };
    var closeSelect = function ()
    {
      $dropDown.hide();
      isShowing = false;
      selectIndex = -1;
      $label.find('@selecter-item').removeClass('selecter__item--hover');
    };
    var blur = function ()
    {
      $(document.body).off('keydown.selecter');
      $label.removeClass('selecter--focused');
      unbind();
    };
    var unbind = function ()
    {
      $(document.body).off('click.selecter');
      binded = false;
    };
    var chooseItem = function ($item)
    {
      $select.val($item.data('value')).trigger('change');
    };
    var selectNext = function ()
    {
      var $selectItems = $label.find('@selecter-item');
      if (selectIndex == $selectItems.length - 1) {
        selectIndex = -1;
      }
      selectIndex++;
      selectByIndex(selectIndex);
    };
    var selectPrev = function ()
    {
      var $selectItems = $label.find('@selecter-item');
      if (selectIndex == 0) {
        selectIndex = $selectItems.length;
      }
      selectIndex--;
      selectByIndex(selectIndex);
    };
    var selectByIndex = function (index)
    {
      var $selectItems = $label.find('@selecter-item');
      $selectItems.removeClass('selecter__item--hover');
      $selectItems.eq(index).addClass('selecter__item--hover');
    }
    var focus = function ()
    {
      $label.addClass('selecter--focused');
      $select.trigger('blur');
      if (!binded) {
        binded = true;
        $(document.body).on('keydown.selecter', function (e)
        {
          if (e.keyCode == 40) {
            if (!isShowing) {
              showSelect();
            }
            else {
              selectNext();
            }
            return false;
          }
          if (e.keyCode == 38) {
            if (isShowing) {
              selectPrev();
              return false;
            }
          }
          if (e.keyCode == 27) {
            closeSelect();
          }
          if (e.keyCode == 9) {
            closeSelect();
            blur();
          }
          if (e.keyCode == 13) {
            if (isShowing && selectIndex != -1) {
              chooseItem($label.find('@selecter-item').eq(selectIndex));
            }
          }
        });
        setTimeout(function () {
          $(document.body).on('click.selecter', function (e)
          {
            closeSelect();
            if (e.target != $label[0]) {
              blur();
            }
          });
        }, 10);
      }
    };
    $select.on('focus', function ()
    {
      focus();
    });
    $label.on('click', function (e)
    {
      if (!isShowing) {
        showSelect();
        focus();
      }
      else {
        closeSelect();
      }
      e.stopPropagation();
    });
    $label.on('click', '@selecter-item', function (e)
    {
      var $item = $(this);
      chooseItem($item);
      e.stopPropagation();
    }).on('mouseover', '@selecter-item', function ()
    {
      var $item = $(this);
      selectIndex = $item.index();
      selectByIndex(selectIndex);
    });
    $select.on('change', function ()
    {
      var value = $select.val();
      var text = $select.find('option[value=' + value + ']').text();
      $label.find('@selecter-value').text(text);
      closeSelect();
    });
  };
  var update = function ($select)
  {
    var $label = $select.parent();
    var $options = $select.find('option');
    var options = [];
    var defaultValue = false;
    if ($select.attr('disabled')) {
      $label.addClass('selecter--disabled');
    }
    else {
      $label.removeClass('selecter--disabled');
    }
    $options.each(function ()
    {
      var $this = $(this);
      if (defaultValue === false) {
        defaultValue = $(this).text();
      }
      if ($this.attr('selected')) {
        defaultValue = $(this).text();
      }
      options.push({label: $(this).text(), value: $(this).attr('value')});
    });
    var dropDown = '';
    options.forEach(function (item)
    {
      dropDown += '<span class="selecter__item" role="selecter-item" data-value="' + item.value + '">' + item.label + '</span>'
    });
    $label.find('@selecter-list').html(dropDown);
    return defaultValue;
  }
  $.fn.selecter = function ()
  {
    return $(this).each(function ()
    {
      var $select = $(this);
      if ($select.data('selecter')) {
        update($select);
      }
      else {
        create($select);
      }
    });
  };
  $(function ()
  {
    $(document.body).on('domupdate', function ()
    {
      $('select').selecter();
    }).trigger('domupdate');
  });
});
