import $ from 'jquery'

$('input:disabled, button:disabled, a.disabled').after(function () {
  var d = $('<div >')
  var i = $(this)
  var offset = i.offset()
  var left_pos = offset.left - $(this).parent().offset().left // due  to table and groupButton
  d.css({
    height: i.outerHeight(),
    width: i.outerWidth(),
    position: 'absolute',
    left: left_pos
  })
  d.attr('title', i.attr('title'))
  d.attr('data-container', 'body') // specific to group Buttons.
  d.tooltip()
  return d
})
