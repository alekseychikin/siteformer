selectSelector = "select"

focusHandler = (e) -> e.target.parentNode.className = "form__select focus"

blurHandler = (e) -> e.target.parentNode.className = "form__select"

bindEvents = (select) ->
  select.addEventListener "focus", focusHandler

  select.addEventListener "blur", blurHandler

unbindEvents = (select) ->
  select.removeEventListener "focus", focusHandler

  select.removeEventListener "blur", blurHandler

elements = Array.from document.querySelectorAll selectSelector
elements.forEach bindEvents

observer = new MutationObserver (mutations) ->
  mutations.forEach (mutation) ->
    if mutation.type == "childList"
      mutation.addedNodes.forEach (element) ->
        if element.nodeType == 1 && element.matches selectSelector
          setTimeout (bindEvents element), 100

      mutation.removedNodes.forEach (element) ->
        if element.nodeType == 1 && element.matches selectSelector
          setTimeout (unbindEvents element), 100

config = attributes: true, childList: true, characterData: true, subtree: true

observer.observe document.body, config
