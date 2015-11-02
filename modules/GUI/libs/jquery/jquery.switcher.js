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
  $.fn.switcher = function ()
  {
    return $(this).each(function ()
    {
      var $switcher = $(this);
      var $values = $switcher.find('@switcher-value');
      $switcher.append('<span class="switcher__wrap"><span class="switcher__ball" role="switcher-ball"></span></span>');
      var $input;
      $switcher.data('value', $values.eq(0).data('value'));
      if ($switcher.attr('name')) {
        var name = $switcher.attr('name');
        $switcher.attr('name', null);
        $input = $('<input type="hidden" name="' + name + '" value="' + $values.eq(0).data('value') + '" />');
        $switcher.append($input);
      }
      var $ball = $switcher.find('@switcher-ball');
      $values.on('click', function ()
      {
        var $value = $(this);
        $switcher.data('value', $value.data('value'));
        if ($input) {
          $input.val($value.data('value'));
          $input.trigger('change');
        }
        else {
          $switcher.trigger('change');
        }
      });
      $switcher.on('change', function ()
      {
        var $value = $values.filter('[data-value="' + $switcher.data('value') + '"]');
        var index = $value.index();
        if (index) {
          $ball.addClass('switcher__ball--right');
        }
        else {
          $ball.removeClass('switcher__ball--right');
        }
      });
    });
  };
  $(function ()
  {
    $('@switcher').switcher();
  });
});
