var {emmitEvent} = require('helpers.coffee');
var initiatedElements = [];
var openned;

document.body.addEventListener('keydown', function (e) {
  if (openned && e.keyCode === 27) {
    if (e.target.nodeName.toLowerCase() === 'input') {
      e.target.blur();
    } else {
      Popup.close(openned);
    }
  }
});

document.body.addEventListener('click', function () {
  if (openned) {
    Popup.close(openned);
  }
});

function elementClickHandler (e) {
  if (e.target.matches('.popup__close') || e.target.closest('.popup__close')) {
    Popup.close(this);
  } else if (e.target.matches('.popup__cancel') || e.target.closest('.popup__cancel')) {
    Popup.close(this);
  } else {
    e.stopPropagation();
  }
}

function initial(element) {
  initiatedElements.push(element);

  element.addEventListener('click', elementClickHandler);
}

var Popup = {
  open: function (selector)
  {
    var wrap, firstElement, element;

    if (typeof selector === 'string') {
      element = document.querySelector(selector);
    } else {
      element = selector;
    }

    if (openned) {
      wrap = openned.parentNode;
      Popup.close(openned, false);
      wrap.appendChild(element);
    } else {
      wrap = document.createElement('div');
      wrap.className = 'popup__wrap';
      element.parentNode.appendChild(wrap);
      wrap.appendChild(element);
    }

    if (initiatedElements.indexOf(element) === -1) {
      initial(element);
    }

    setTimeout(function () {
      openned = element;
    }, 10);

    setTimeout(function () {
      element.classList.add('popup--open');
      wrap.classList.add('popup__wrap--open');

      firstElement = element.querySelector('input[type="text"], input[type="password"]');
      if (firstElement) {
        firstElement.focus();
      }

      document.body.classList.add('g-fix');
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

    var parent = element.parentNode;
    element.classList.remove('popup--open');
    emmitEvent('popup-close', element);

    if (closeBack) {
      parent.classList.remove('popup__wrap--open');
      document.body.classList.remove('g-fix');
    }

    openned = null;

    setTimeout(function () {
      if (parent.classList.contains('popup__wrap')) {
        if (parent.nextSibling) {
          parent.parentNode.insertBefore(element, parent.nextSibling);
        } else {
          parent.parentNode.appendChild(element);
        }

        parent.after(element);

        if (closeBack) {
          parent.parentNode.removeChild(parent);
        }
      }
    }, 250);
  }
};

Array.prototype.slice.call(document.querySelectorAll('[data-popup]')).forEach(function (item) {
  item.addEventListener('click', function () {
    Popup.open('#popup-' + item.getAttribute('data-popup'));
  });
});

module.exports = Popup;
