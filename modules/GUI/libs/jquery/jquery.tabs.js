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
  $.fn.tabs = function ()
  {
    var groups = {};
    $(this).each(function ()
    {
      var $this = $(this);
      if (!groups[$this.data('group')]) {
        groups[$this.data('group')] = $this;
      }
      else {
        groups[$this.data('group')] = groups[$this.data('group')].add($this);
      }
    });
    $.each(groups, function (group, $items)
    {
      var $item = $(this);
      $items.off('click.tabs');
      $items.on('click.tabs', function ()
      {
        var $item = $(this);
        $items.not($item).each(function ()
        {
          var $item = $(this);
          $item.removeModify('active');
          $('@' + $item.data('frame')).hide();
        });
        $item.addModify('active');
        $('@' + $item.data('frame')).show();
        $item.trigger('change');
      });
    });
  };

  $(function ()
  {
    $('@tabs').tabs();
  });
});
