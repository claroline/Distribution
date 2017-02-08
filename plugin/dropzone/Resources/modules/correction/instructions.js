import $ from 'jquery'

$(document).on('ready', function () {
  $('#correction-instruction').on('hide.bs.collapse', () => {
    $('#accordion .fa-angle-down').show()
    $('#accordion .fa-angle-right').hide()
  })
  $('#correction-instruction').on('show.bs.collapse', () => {
    $('#accordion .fa-angle-right').show()
    $('#accordion .fa-angle-down').hide()
  })
})