$lastFakeInp = null
stayOpening = false
lastDate = null
skipGenerateTable = false

$ = require "jquery-plugins.coffee"
$body = $ document.body
template = "<div class='form__calendar'>
  <span class='form__calendar-arrow form__calendar-arrow--left'></span>
  <span class='form__calendar-arrow form__calendar-arrow--right'></span>
  <div class='form__calendar-month'></div>
  <div class='form__calendar-days'>
  </div>
</div>"
$document = $ document

INPUT_HEIGHT = 50
MONTHS = [
  "Январь"
  "Февраль"
  "Март"
  "Апрель"
  "Май"
  "Июнь"
  "Июль"
  "Август"
  "Сентябрь"
  "Октябрь"
  "Ноябрь"
  "Декабрь"
]

$calendar = $ template
$calendarDays = $calendar.find ".form__calendar-days"
$formCalendarMonth = $calendar.find ".form__calendar-month"
$formCalendarArrowLeft = $calendar.find ".form__calendar-arrow--left"
$formCalendarArrowRight = $calendar.find ".form__calendar-arrow--right"

$body.append $calendar

generateTable = (date) ->
  date = date.match /(\d{4})\-(\d{1,2})\-(\d{1,2})/
  lastDate = date
  date[2] = parseInt(date[2], 10) - 1

  currentDate = new Date date[1], date[2], date[3]
  firstDayOfMonth = new Date date[1], date[2], 1

  d = new Date date[1], date[2] + 1, 0
  daysInMonth = d.getDate();

  today = new Date()

  dayOfWeek = if currentDate.getDay() == 0 then 7 else currentDate.getDay()
  firstDayOfWeek = if firstDayOfMonth.getDay() == 0 then 7 else firstDayOfMonth.getDay()

  monthCalendar = "<table class='form__calendar-table'>
    <tr>
      <th>Пн</th>
      <th>Вт</th>
      <th>Ср</th>
      <th>Чт</th>
      <th>Пт</th>
      <th>Сб</th>
      <th>Вс</th>
    </tr>"
  monthCalendar += "<tr>"

  monthCalendar += "<td></td>" for i in [1...firstDayOfWeek]

  for j in [i..daysInMonth + i]
    className = 'form__calendar-cell'
    day = j - i + 1
    month = date[2] + 1

    if day == today.getDate() &&
    date[2] == today.getMonth() &&
    +date[1] == today.getFullYear()

      className += ' form__calendar-cell--today'

    monthCalendar += "<tr>" if (j - 1) % 7 == 0
    monthCalendar += "<td>
      <span class='#{className}'
      data-value='#{day}-#{month}-#{date[1]}'
      >#{day}</span>
    </td>"
    monthCalendar += "</tr>" if j % 7 == 0

  monthCalendar += "</table>"

  $calendarDays.html monthCalendar
  $formCalendarMonth.html MONTHS[date[2]]

isTouchDevice = =>
  ("ontouchstart" in window) ||
  (navigator.MaxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0)

makeFakeInput = ($src) ->
  $input = $ "<input class='form__date-fake' type='text' />"
  $body.append $input
  $input

updateFakeInputValue = ($src) ->
  offset = $src.offset()
  value = $src.val().match /^(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})$/
  if value
    $lastFakeInp.val "#{value[3]}.#{value[2]}.#{value[1]}"
  $lastFakeInp.css
    top: "#{offset.top}px"
    left: "#{offset.left}px"

formateDate = (date) ->
  value = date.match /^(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{4})$/
  if value
    value[1] = if value[1].length == 1 then "0#{value[1]}" else value[1]
    value[2] = if value[2].length == 1 then "0#{value[2]}" else value[2]
    return "#{value[1]}.#{value[2]}.#{value[3]}"
  return ""

$calendar.on "mousedown", ".form__calendar-cell", (e) ->
  stayOpening = true

$calendar.on "click", ".form__calendar-cell", (e) ->
  $cell = $(this)
  date = $cell.attr 'data-value'
  $lastFakeInp.val date
  $lastFakeInp.trigger "change"

$formCalendarArrowLeft.on "mousedown", ->
  stayOpening = true
  skipGenerateTable = true

$formCalendarArrowLeft.on "click", ->
  date = new Date lastDate[1], lastDate[2] - 1, lastDate[3]
  generateTable "#{date.getFullYear()}-#{date.getMonth() + 1}-#{date.getDate()}"
  $lastFakeInp.focus()

$formCalendarArrowRight.on "mousedown", ->
  stayOpening = true
  skipGenerateTable = true

$formCalendarArrowRight.on "click", ->
  date = new Date lastDate[1], lastDate[2] + 1, lastDate[3]
  generateTable "#{date.getFullYear()}-#{date.getMonth() + 1}-#{date.getDate()}"
  $lastFakeInp.focus()

if !isTouchDevice()
  $ "[type=date]"
  .each ->
    $input = $ this
    $fakeInp = makeFakeInput $input
    $lastFakeInp = $fakeInp

    updateFakeInputValue $input

    $input.on "change", ->
      updateFakeInputValue $input

    $input
    .siblings ".form__inp-empty"
    .on "click", ->
      $fakeInp
      .val ""
      .trigger "change"

    $input.on "focus", ->
      $fakeInp.focus()

    $fakeInp.on "focus", ->
      $input.addClass "focus"
      value = $input.val().match /^(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})$/
      offset = $fakeInp.offset()

      if !value
        value = new Date()
        value = [
          value.getFullYear()
          value.getMonth()
          value.getDate()
        ]

      if skipGenerateTable
        skipGenerateTable = false
      else
        generateTable "#{value[1]}-#{value[2]}-#{value[3]}"

      height = $calendar.outerHeight()

      if offset.top + height + INPUT_HEIGHT > $document.outerHeight()
        $calendar
        .addClass "form__calendar--top"
        .css
          top: "#{offset.top - height - 15}px"
          left: "#{offset.left}px"
        .addClass "form__calendar--show"
      else
        $calendar
        .removeClass "form__calendar--top"
        .css
          top: "#{offset.top + INPUT_HEIGHT}px"
          left: "#{offset.left}px"

    $fakeInp.on "change", ->
      value = $fakeInp.val()
      $fakeInp.val formateDate value
      value = value.match /^(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{4})$/
      if value
        value[1] = if value[1].length == 1 then "0#{value[1]}" else value[1]
        value[2] = if value[2].length == 1 then "0#{value[2]}" else value[2]
        $input.val "#{value[3]}-#{value[2]}-#{value[1]}"
      else
        $input.val ""
      $input.trigger "change"
      $fakeInp.trigger "blur"

    $fakeInp.on "blur", ->
      setTimeout =>
        if !stayOpening
          $calendar
          .removeClass "form__calendar--show"
          .css
            left: ""
          $input.removeClass "focus"
        stayOpening = false
      , 100

    $fakeInp.on "keydown", (e) ->
      if e.keyCode == 9
        $inputs = $body.find "input, select, button"
        prevInput = $inputs[$inputs.length - 1]
        nextInput = false

        if e.shiftKey
          $inputs.each ->
            if this == $input[0]
              $ prevInput
              .focus()

              return false
            prevInput = this
        else
          $inputs.each ->
            if nextInput
              $ this
              .focus()

              return false

            if this == $input[0]
              nextInput = this

          if !nextInput
            $inputs
            .first()
            .focus()

        e.preventDefault()
