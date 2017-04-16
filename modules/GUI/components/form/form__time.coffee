{emmitEvent} = require "helpers.coffee"

isTouchDevice = ->
  ("ontouchstart" in window) ||
  (navigator.MaxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0)

makeFakeInput = (src) ->
  input = document.createElement "input"
  input.classList.add "form__time-fake"
  input.type = "text"
  document.body.appendChild input
  input

formateDate = (date) ->
  value = date.match /^(\d{1,2})[^\d]+(\d{1,2})$/

  if value
    value[1] = if value[1].length == 1 then "0#{value[1]}" else value[1]
    value[2] = if value[2].length == 1 then "0#{value[2]}" else value[2]
    return "#{value[1]}:#{value[2]}"
  return ""

class TimeControl
  constructor: (input) ->
    @fakeInp = makeFakeInput()

    @updateFakeInputValue input

    input.addEventListener "change", => @updateFakeInputValue input

    input.parentNode.querySelector ".form__inp-empty"
    input.addEventListener "click", =>
      @fakeInp.value = ""
      emmitEvent "change", @fakeInp

    input.addEventListener "focus", =>
      @fakeInp.focus()

    @fakeInp.addEventListener "focus", =>
      @fakeInp.classList.add "focus"

    @fakeInp.addEventListener "blur", =>
      @fakeInp.classList.remove "focus"

    @fakeInp.addEventListener "change", =>
      value = @fakeInp.value
      @fakeInp.value = formateDate value
      value = value.match /^(\d{1,2})[^\d]+(\d{1,2})$/

      if value
        value[1] = if value[1].length == 1 then "0#{value[1]}" else value[1]
        value[2] = if value[2].length == 1 then "0#{value[2]}" else value[2]
        input.value = "#{value[1]}:#{value[2]}"
      else
        input.value = ""

      emmitEvent "change", input
      emmitEvent "blur", @fakeInp

    @fakeInp.addEventListener "keydown", (e) ->
      if e.keyCode == 9
        inputs = Array.from document.body.querySelectorAll "input, select, button"
        prevInput = inputs[inputs.length - 1]
        nextInput = false

        if e.shiftKey
          inputs.forEach (item) ->
            if item == input
              prevInput.focus()

              return false
            prevInput = item
        else
          inputs.forEach (item) ->
            if nextInput
              item.focus()

              return false

            nextInput = item if item == input

          if !nextInput
            inputs[0].focus()

        e.preventDefault()

  updateFakeInputValue: (src) ->
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0
    offset = src.getBoundingClientRect()
    offset =
      top: offset.top + scrollTop
      left: offset.left
    value = src.value.match /^(\d{1,2})[^\d]+(\d{1,2})$/

    @fakeInp.value = "#{value[1]}:#{value[2]}" if value

    @fakeInp.style.top = "#{offset.top}px"
    @fakeInp.style.left = "#{offset.left}px"

if !isTouchDevice()
  Array.from(document.querySelectorAll "[type=time]").forEach (item) -> new TimeControl item
