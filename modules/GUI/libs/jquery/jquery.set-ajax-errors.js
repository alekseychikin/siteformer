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
  $(document).ajaxError(function(e, xhr) {
    var error, obj;
    obj = false;
    try {
      obj = $.parseJSON(xhr.responseText);
    } catch (_error) {
      error = _error;
      obj = {
        error: xhr.responseText
      };
    }
    if (xhr.status === 422) {
      alert(obj.error);
    } else if (xhr.status === 401) {
      // return console.error("Авторизация нужна");
      window.location.reload(true);
    }
  });
  SF.request.addDefaultError(function (xhr, obj)
  {
    if (xhr.status === 422) {
      alert(obj.error);
    } else if (xhr.status === 401) {
      // return console.error("Авторизация нужна");
      // window.location.reload(true);
    }
  });
});
