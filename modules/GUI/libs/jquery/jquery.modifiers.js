(function (factory)
{
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery', 'jquery.role', 'jquery.modifier'], factory);
  }
  else {
    // Browser globals
    factory(window.jQuery);
  }
})(function ($)
{
  $.fn.addModify = function (mod)
  {
    $(this).each(function ()
    {
      var $item = $(this);
      var classes = $item.attr('class').split(' ');
      if (classes.indexOf(classes[0] + '--' + mod) === -1) {
        classes.push(classes[0] + '--' + mod);
        $item.attr('class', classes.join(' '));
      }
    });
  };

  $.fn.removeModify = function (mod)
  {
    $(this).each(function ()
    {
      var $item = $(this);
      var classes = $item.attr('class').split(' ');
      if (classes.indexOf(classes[0] + '--' + mod) !== -1) {
        classes.splice(classes.indexOf(classes[0] + '--' + mod), 1);
        $item.attr('class', classes.join(' '));
      }
    });
  };

  $.fn.toggleModify = function (mod)
  {
    $(this).each(function ()
    {
      var $item = $(this);
      var classes = $item.attr('class').split(' ');
      if (classes.indexOf(classes[0] + '--' + mod) !== -1) {
        classes.splice(classes.indexOf(classes[0] + '--' + mod), 1);
      }
      else {
        classes.push(classes[0] + '--' + mod);
      }
      $item.attr('class', classes.join(' '));
    });
  };

  $.fn.hasModify = function (mod)
  {
    var $item = $(this);
    var classes = $item.attr('class').split(' ');
    return classes.indexOf(classes[0] + '--' + mod) !== -1;
  };

});
