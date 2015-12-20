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
  $('@table-controls-top').each(function ()
  {
    var $controls = $(this);
    var offset = $controls.offset().top;
    var clinged = false;
    $(window).on('scroll', function ()
    {
      var scrollTop = $(window).scrollTop();
      if (scrollTop > offset - 20 && !clinged) {
        clinged = true;
        $controls.addClass('table__controls--clinged');
      }
      else if (scrollTop < offset - 20 && clinged) {
        clinged = false;
        $controls.removeClass('table__controls--clinged');
      }
    }).trigger('scroll');
  });
});
