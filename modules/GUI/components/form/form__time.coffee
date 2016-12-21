$ = require "jquery-plugins.coffee"
$body = $ document.body

isTouchDevice = ->
  ("ontouchstart" in window) ||
  (navigator.MaxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0)

makeFakeInput = ($src) ->
  $input = $ "<input class='form__time-fake' type='text' />"
  $body.append $input
  $input

formateDate = (date) ->
  value = date.match /^(\d{1,2})[^\d]+(\d{1,2})$/

  if value
    value[1] = if value[1].length == 1 then "0#{value[1]}" else value[1]
    value[2] = if value[2].length == 1 then "0#{value[2]}" else value[2]
    return "#{value[1]}:#{value[2]}"
  return ""

class TimeControl
  constructor: (input) ->
    $input = $ input
    @$fakeInp = makeFakeInput $input

    @updateFakeInputValue $input

    $input.on "change", => @updateFakeInputValue $input

    $input
      .siblings ".form__inp-empty"
      .on "click", =>
        @$fakeInp
        .val ""
        .trigger "change"

    $input.on "focus", =>
      @$fakeInp.focus()

    @$fakeInp.on "focus", =>
      @$fakeInp.addClass "focus"

    @$fakeInp.on "blur", =>
      @$fakeInp.removeClass "focus"

    @$fakeInp.on "change", =>
      value = @$fakeInp.val()
      @$fakeInp.val formateDate value
      value = value.match /^(\d{1,2})[^\d]+(\d{1,2})$/

      if value
        value[1] = if value[1].length == 1 then "0#{value[1]}" else value[1]
        value[2] = if value[2].length == 1 then "0#{value[2]}" else value[2]
        $input.val "#{value[1]}:#{value[2]}"
      else
        $input.val ""

      $input.trigger "change"
      @$fakeInp.trigger "blur"

    @$fakeInp.on "keydown", (e) ->
      if e.keyCode == 9
        $inputs = $body.find "input, select, button"
        prevInput = $inputs[$inputs.length - 1]
        nextInput = false

        if e.shiftKey
          $inputs.each ->
            if @ == $input[0]
              $ prevInput
                .focus()

              return false
            prevInput = @
        else
          $inputs.each ->
            if nextInput
              $ @
                .focus()

              return false

            nextInput = @ if @ == $input[0]

          if !nextInput
            $inputs
              .first()
              .focus()

        e.preventDefault()

  updateFakeInputValue: ($src) ->
    offset = $src.offset()
    value = $src.val().match /^(\d{1,2})[^\d]+(\d{1,2})$/

    @$fakeInp.val "#{value[1]}:#{value[2]}" if value

    @$fakeInp.css
      top: "#{offset.top}px"
      left: "#{offset.left}px"


if !isTouchDevice()
  ($ "[type=time]").each -> new TimeControl @
