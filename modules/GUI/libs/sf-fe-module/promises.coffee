class Promise
  @when: (tasks...) ->
    num_uncompleted = tasks.length
    args = new Array(num_uncompleted)
    promise = new Promise()

    for task, task_id in tasks
      do (task_id) ->
        task.then ->
          args[task_id] = Array.prototype.slice.call arguments
          num_uncompleted--
          promise.complete args... if num_uncompleted == 0

    promise

  constructor: ->
    @completed = false
    @callbacks = []

  complete: ->
    @completed = true
    @data = arguments
    for callback in @callbacks
      callback arguments...

  then: (callback) ->
    if @completed == true
      callback @data...
      return

    @callbacks.push callback

if module? && module.exports?
  module.exports = Promise
