(function (factory)
{
  if (typeof define === "function" && define.amd) {
    // Register as an anonymous AMD module:
    define(["jquery"], factory);
  } else {
    // Browser globals:
    factory(window.jQuery);
  }
})(function ($)
{
  window.money = function (value)
  {
    if (!value) return '0<sup>.00</sup>';
    if (typeof value.toString === 'function')
      value = value.toString();
    value = value.replace(',', '.');
    if (value.indexOf('.') === -1) {
      value += '.00';
    }
    _float = value.substr(value.indexOf('.'));
    if (_float.length > 3)
      _float = _float.substr(0, 3);
    for (var i = 0, len = 3 - _float.length; i < len; i++) _float += '0';
    value = value.substr(0, value.indexOf('.')) + '<sup>' + _float + '</sup>';
    return value;
  };

  window.phone = function (value)
  {
    if (value.length == 10) {
      var code = value.substr(0, 3);
      var phone = value.substr(3, 3) + '-' + value.substr(6, 2) + '-' + value.substr(8);
      value = '+7&nbsp;' + code + '&nbsp;' + phone;
    }
    else if (value.length == 6) {
      value = value.substr(0, 2) + '-' + value.substr(2, 2) + '-' + value.substr(4);
    }
    return value;
  };

  window.getAddressText = function (address)
  {
    var addressText = "";
    if (address.city != undefined) {
      addressText += address.city;
    }
    if (address.street != "") {
      addressText += ", " + address.street;
    }
    if (address.house != "") {
      addressText += ", дом " + address.house;
    }
    if (address.building != "") {
      addressText += " " + address.building;
    }
    if (address.entrance != "") {
      addressText += ", " + address.entrance + " подъезд";
    }
    if (address.floor != "") {
      addressText += ", " + address.floor + " этаж";
    }
    if (address.flat != "") {
      addressText += ", кв " + address.flat;
    }
    if (address.code != "") {
      addressText += ", домофон " + address.code;
    }
    return addressText;
  };

  window.getPriceByOptions = function  (price, options) {
    var percents = [];
    options.forEach(function (option)
    {
      var optPrice = option.price;
      if (typeof optPrice.toString === 'function') {
        optPrice = optPrice.toString();
      }
      if (optPrice.substr(-1) == "%") {
        percents.push(float(optPrice));
      }
    });
    percents.forEach(function (percent)
    {
      price += price * (percent / 100);
    });
    return price;
  };

  window.paragraph = function (value)
  {
    return '<p>' + value.split('\n').filter(function (value)
    {
      return value.length > 0;
    }).join('</p><p>') + '</p>';
  };

  (function ($)
  {
    $.fn.serializeObject = function ()
    {
      var o = {};
      var a = $(this).serializeArray();
      $.each(a, function ()
      {
        if (o[this.name]) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        }
        else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    }
  })($);
});
