import $ from 'jquery'
import 'bootstrap-datepicker'

$(document).ready(function () {
  if (!IsInputTypeSupported('date')) {
    $(`#${window.formId}_date`).datepicker(window.options)
  }

  if (!IsInputTypeSupported('time')) {
    $(`#${window.formId}_time`).keyup(function (e) {
      // do nothing if this is a delete or suppr key.
      if (e.keyCode != 8 && e.keyCode != 46) {
        var time // will be the returned value
        var val = $(this).val() // value of the input
        var sep = ':' // hours separator
        var lg = $(this).val().length // length of the input value
        var hours = val.substr(0, 2) // supposed hours
        var min = val.substr(3, 2) // supposed minutes.
        var default_val = '00' // default value when something is wrong.

        if (val == '') {
          // if empty, set the default value
          time = default_val + sep + default_val
        } else {
          // if hours are not a correct Integer, set the default value
          if (isNaN(parseInt(hours))) {
            hours = default_val
          }
          // if minutes exist but are not a correct Integer, set the default value
          if (min != '' && isNaN(parseInt(min))) {
            min = default_val
          }
          // if hours are not in the correct range, set the default.
          if (hours < 0 || hours > 23) {
            hours = default_val
          }
          // if mins are not in the correct range, set the default
          if (min < 0 || min > 59) {
            min = default_val
          }
          // if there is no minute or separator.
          if (lg < 2) {
            sep = ''
            min = ''
          }
          // setting a correct time value.
          time = hours + sep + min
        }
        // push the value in the input.
        $(this).val(time)
      }
    })
  }
})

/**
 *  Check if browser support the type of input.
 * @param typeName
 * @returns {boolean}
 * @constructor
 */
function IsInputTypeSupported (typeName) {
  // Create element
  var input = document.createElement('input')
  // attempt to set the specified type
  input.setAttribute('type', typeName)
  // If the "type" property equals "text"
  // then that input type is not supported
  // by the browser
  var val = (input.type !== 'text')

  // Return the detected value
  return val
}
