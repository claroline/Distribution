import $ from 'jquery'

$(document).on('ready', function () {
  $('#recall-instruction-notation').on('hide.bs.collapse', function () {
    $('#accordion .fa-angle-down').show()
    $('#accordion .fa-angle-right').hide()
  })
  $('#recall-instruction-notation').on('show.bs.collapse', function () {
    $('#accordion .fa-angle-right').show()
    $('#accordion .fa-angle-down').hide()
  })
})
