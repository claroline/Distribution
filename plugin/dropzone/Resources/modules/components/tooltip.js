import $ from 'jquery'

$(document).ready(function () {
  /**
   Allow to use tooltip in disable button inside a button group
   creating a div in absolute pos
   **/
  $('input:disabled, button:disabled, a.disabled').after(function() {
    const d = $('<div >')
    const i = $(this)
    const offset = i.offset()
    const left_pos = offset.left - $(this).parent().offset().left // due  to table and groupButton
    d.css({
      height: i.outerHeight(),
      width: i.outerWidth(),
      position: 'absolute',
      left: left_pos
    })
    d.attr('title', i.attr('title'))
    d.attr('data-placement', i.attr('data-placement'))
    d.attr('data-container', 'body') // specific to group Buttons.
    d.tooltip()

    return d
  })
})