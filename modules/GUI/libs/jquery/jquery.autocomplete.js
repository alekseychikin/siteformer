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
  var templateWrap = '<ul class="autocomplete"></ul>';
  var templateItem = '<li role="autocomplete-item" data-value="#1" class="autocomplete__item">#1</li>';
  var inputs = {};
  $.fn.autocomplete = function ()
  {
    var $body = $(document.body);
    $(this).each(function ()
    {
      var $input = $(this);
      if ($input.data('init')) {
        return ;
      }
      $input.data('init', true);
      var srcuri = $input.data('autouri');
      var field = $input.data('autofield');
      var lastSrc = '';
      var isOpen = false;
      var offset = $input.offset();
      var height = $input.outerHeight();
      var $drop = $(templateWrap);
      $drop.data('autocomplete-input', 'autocomplete' + count);
      inputs['autocomplete' + count] = $input;
      count++;
      $body.append($drop);
      var selectedIndex = -1;
      var elements = 0;
      var $elements;
      var close = function ()
      {
        $drop.empty();
        selectedIndex = -1;
        elements = 0;
        $drop.removeClass('autocomplete--show');
        isOpen = false;
        lastSrc = '';
        $body.off('click.autocomplete');
      };
      var open = function ()
      {
        offset = $input.offset();
        height = $input.outerHeight();
        $drop.css({left: offset.left + 'px', top: offset.top + height + 'px'});
        $drop.addClass('autocomplete--show');
        isOpen = true;
        $body.on('click.autocomplete', function ()
        {
          if (isOpen) {
            close();
          }
        });
      };
      var search = function ()
      {
        var src = $input.val();
        if ($input.prop("readonly")) {
          return false;
        }
        if (src.length && lastSrc != src) {
          if (!isOpen) {
            open();
          }
          lastSrc = src;
          $.post(srcuri, {src: src}, function (data)
          {
            $drop.empty();
            selectedIndex = -1;
            elements = data.data.length;
            $.each(data.data, function (index, item)
            {
              $drop.append(templateItem.replace(/#1/g, item[field]));
            });
            $elements = $drop.find('@autocomplete-item');
            if (!elements) {
              if (isOpen) {
                close();
              }
            }
          }, 'json');
        }
        else {
          lastSrc = '';
          if (isOpen) {
            close();
          }
        }
      };
      $input.on('input', function ()
      {
        search();
      });
      // $input.on('focus', function ()
      // {
      //   if (!isOpen) {
      //     search();
      //   }
      // });
      $input.on('keydown', function (e)
      {
        if (isOpen) {
          if (e.keyCode == 40) { // down
            e.stopPropagation();
            e.preventDefault();
            if (selectedIndex < elements - 1) {
              selectedIndex++;
            }
            else if (selectedIndex == elements - 1) {
              selectedIndex = 0;
            }
            $elements.removeClass('autocomplete__item--selected');
            $elements.eq(selectedIndex).addClass('autocomplete__item--selected');
          }
          else if (e.keyCode == 38) { // up
            e.stopPropagation();
            e.preventDefault();
            if (selectedIndex > 0) {
              selectedIndex--;
            }
            else if (selectedIndex <= 0) {
              selectedIndex = elements - 1;
            }
            $elements.removeClass('autocomplete__item--selected');
            $elements.eq(selectedIndex).addClass('autocomplete__item--selected');
          }
          else if (e.keyCode == 27) {
            e.stopPropagation();
            e.preventDefault();
            close();
          }
          else if (e.keyCode == 13) {
            if (selectedIndex != -1) {
              var value = $elements.eq(selectedIndex).data('value');
              $input.val(value).trigger('input').trigger('change');
              e.stopPropagation();
              e.preventDefault();
            }
            close();
          }
        }
      });
      $input.on('click', function (e)
      {
        e.stopPropagation();
        e.preventDefault();
      });
      $drop.on('click', function (e)
      {
        e.stopPropagation();
        e.preventDefault();
      });
      $drop.on('mouseover', '@autocomplete-item', function ()
      {
        var $item = $(this);
        var index = $item.index();
        selectedIndex = index;
        $elements.removeClass('autocomplete__item--selected');
        $elements.eq(selectedIndex).addClass('autocomplete__item--selected');
      });
      $drop.on('mousedown', '@autocomplete-item', function ()
      {
        var $item = $(this);
        var value = $item.data('value');
        $input.val(value).trigger('input').trigger('change');
        close();
      });
    });
  };
  $(function ()
  {
    $(document.body).on('domupdate', function ()
    {
      $('@autocomplete').autocomplete();
    }).trigger('domupdate');
  });
});
