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
  var create = function ($input)
  {
    $input.data('checker', true);
    var classes = $input.attr('class') ? $input.attr('class').split(' ') : [];
    if ($input.attr('type') == 'checkbox') {
      classes.unshift('checker--checkbox');
    }
    else if ($input.attr('type') == 'radio') {
      classes.unshift('checker--radio');
    }
    classes.unshift('checker');
    classes = classes.join(' ');
    $input.attr('class', '');
    $input.attr('readonly', true);
    var id = $input.attr('id') || 'checker' + count++;
    $input.attr('id', id);
    $input.wrap('<label class="' + classes + '" for="' + id + '" />');
    var $label = $input.parent();
    if ($input.is(':checked')) {
      $label.addClass('checker--checked');
    }
    var firstClick = true;
    $label.on('click', function (e)
    {
      if (firstClick) {
        firstClick = false;
        e.stopPropagation();
      }
      else {
        firstClick = true;
      }
    });
    var stop = false;
    $input.on('change', function (e)
    {
      if ($input.attr('type') == 'checkbox') {
        if ($input.is(':checked')) {
          $label.addClass('checker--checked');
        }
        else {
          $label.removeClass('checker--checked');
        }
      }
      else {
        var $inputs = $(document.body).find('input[name="' + $input.attr('name') + '"]');
        $inputs.each(function ()
        {
          var $inp = $(this);
          var $lab = $inp.parent();
          if ($inp.is(':checked')) {
            $lab.addClass('checker--checked');
          }
          else {
            $lab.removeClass('checker--checked');
          }
        });
      }
    });
  };
  $.fn.checker = function ()
  {
    return $(this).each(function ()
    {
      var $input = $(this);
      if (!$input.data('checker')) {
        create($input);
      }
    });
  };
  $(function ()
  {
    $(document.body).on('domupdate', function ()
    {
      $('input[type=checkbox]').checker();
      $('input[type=radio]').checker();
    }).trigger('domupdate');
  });
});
