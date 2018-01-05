{emmitEvent} = require "libs/helpers.coffee"

stayOpening = false
skipGenerateTable = false
template = """
  <span class='form__calendar-arrow form__calendar-arrow--left'></span>
  <span class='form__calendar-arrow form__calendar-arrow--right'></span>
  <div class='form__calendar-month'></div>
  <div class='form__calendar-days'></div>
"""

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

isTouchDevice = ->
  ("ontouchstart" in window) ||
  (navigator.MaxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0)

makeFakeInput = ->
  input = document.createElement "input"
  input.classList.add "form__date-fake"
  input.type = "text"
  document.body.appendChild input
  input

formateDate = (date) ->
  value = date.match /^(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{4})$/
  if value
    value[1] = if value[1].length == 1 then "0#{value[1]}" else value[1]
    value[2] = if value[2].length == 1 then "0#{value[2]}" else value[2]
    return "#{value[1]}.#{value[2]}.#{value[3]}"
  return ""

class DateControl
  constructor: (input) ->
    @fakeInp = makeFakeInput()

    @calendar = document.createElement "div"
    @calendar.classList.add "form__calendar"
    @calendar.innerHTML = template
    @calendarDays = @calendar.querySelector ".form__calendar-days"
    @formCalendarMonth = @calendar.querySelector ".form__calendar-month"
    formCalendarArrowLeft = @calendar.querySelector ".form__calendar-arrow--left"
    formCalendarArrowRight = @calendar.querySelector ".form__calendar-arrow--right"

    @lastDate

    document.body.appendChild @calendar

    @calendar.addEventListener "mousedown", (e) ->
      if e.target.closest ".form__calendar-cell" || e.target.matches ".form__calendar-cell"
        stayOpening = true

    self = @

    @calendar.addEventListener "click", (e) =>
      cell = if e.target.matches ".form__calendar-cell" then e.target else e.target.closest ".form__calendar-cell"

      if cell
        date = cell.getAttribute "data-value"
        @fakeInp.value = date
        emmitEvent "change", @fakeInp

    formCalendarArrowLeft.addEventListener "mousedown", ->
      stayOpening = true
      skipGenerateTable = true

    formCalendarArrowLeft.addEventListener "click", =>
      date = new Date @lastDate[1], @lastDate[2] - 1, @lastDate[3]
      @generateTable "#{date.getFullYear()}-#{date.getMonth() + 1}-#{date.getDate()}"
      @fakeInp.focus()

    formCalendarArrowRight.addEventListener "mousedown", ->
      stayOpening = true
      skipGenerateTable = true

    formCalendarArrowRight.addEventListener "click", =>
      date = new Date @lastDate[1], @lastDate[2] + 1, @lastDate[3]
      @generateTable "#{date.getFullYear()}-#{date.getMonth() + 1}-#{date.getDate()}"
      @fakeInp.focus()

    @updateFakeInputValue input

    input.addEventListener "change", =>
      @updateFakeInputValue input

    input.parentNode.querySelector(".form__inp-empty").addEventListener "click", =>
      @fakeInp.value = ""
      emmitEvent "change", @fakeInp

    input.addEventListener "focus", =>
      @fakeInp.focus()

    @fakeInp.addEventListener "focus", =>
      input.classList.add "focus"
      inputHeight = input.offsetHeight
      value = input.value.match /^(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})$/
      scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0
      offset = @fakeInp.getBoundingClientRect()
      offset =
        top: offset.top + scrollTop
        left: offset.left
      documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )

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
        @generateTable "#{value[1]}-#{value[2]}-#{value[3]}"

      calendarHeight = @calendar.offsetHeight

      if offset.top + calendarHeight + inputHeight > documentHeight
        @calendar.classList.add "form__calendar--top"
        @calendar.style.top = "#{offset.top - calendarHeight - 15}px"
        @calendar.style.left = "#{offset.left}px"
        @calendar.classList.add "form__calendar--show"
      else
        @calendar.classList.remove "form__calendar--top"
        @calendar.style.top = "#{offset.top + inputHeight + 15}px"
        @calendar.style.left = "#{offset.left}px"

    @fakeInp.addEventListener "change", =>
      value = @fakeInp.value
      @fakeInp.value = formateDate value
      value = value.match /^(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{4})$/

      if value
        value[1] = if value[1].length == 1 then "0#{value[1]}" else value[1]
        value[2] = if value[2].length == 1 then "0#{value[2]}" else value[2]
        input.value = "#{value[3]}-#{value[2]}-#{value[1]}"
      else
        input.value = ""

      emmitEvent "change", input
      emmitEvent "blur", @fakeInp

    @fakeInp.addEventListener "blur", =>
      setTimeout =>
        if !stayOpening
          @calendar.classList.remove "form__calendar--show"
          @calendar.style.left = ""
          input.classList.remove "focus"
        stayOpening = false
      , 10

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

  generateTable: (date) ->
    today = new Date()

    date = date.match /(\d{4})\-(\d{1,2})\-(\d{1,2})/

    date = ["", today.getFullYear(), today.getMonth() + 1, today.getDate()] if !date

    @lastDate = date
    date[2] = parseInt(date[2], 10) - 1

    currentDate = new Date date[1], date[2], date[3]
    firstDayOfMonth = new Date date[1], date[2], 1

    d = new Date date[1], date[2] + 1, 0
    daysInMonth = d.getDate()

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
      className = "form__calendar-cell"
      day = j - i + 1
      month = date[2] + 1

      if day == today.getDate() &&
        date[2] == today.getMonth() &&
        +date[1] == today.getFullYear()

          className += " form__calendar-cell--today"

      monthCalendar += "<tr>" if (j - 1) % 7 == 0
      monthCalendar += "<td>
        <span class='#{className}'
        data-value='#{day}-#{month}-#{date[1]}'
        >#{day}</span>
      </td>"
      monthCalendar += "</tr>" if j % 7 == 0

    monthCalendar += "</table>"

    @calendarDays.innerHTML = monthCalendar
    @formCalendarMonth.innerHTML = MONTHS[date[2]]

  updateFakeInputValue: (src) ->
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0
    offset = src.getBoundingClientRect()
    offset =
      top: offset.top + scrollTop
      left: offset.left
    value = src.value.match /^(\d{4})[^\d]+(\d{1,2})[^\d]+(\d{1,2})$/

    @fakeInp.value = "#{value[3]}.#{value[2]}.#{value[1]}" if value

    @fakeInp.style.top = "#{offset.top}px"
    @fakeInp.style.left = "#{offset.left}px"

if !isTouchDevice()
  Array.from(document.querySelectorAll "[type=date]").forEach (item) -> new DateControl item
