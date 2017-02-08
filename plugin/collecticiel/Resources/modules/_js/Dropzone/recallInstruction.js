import $ from 'jquery'

$(document).on('ready', function () {
  $('#recall-instruction').on('hide.bs.collapse', function () {
    $('#accordion .fa-angle-down').show()
    $('#accordion .fa-angle-right').hide()
  })
  $('#recall-instruction').on('show.bs.collapse', function () {
    $('#accordion .fa-angle-right').show()
    $('#accordion .fa-angle-down').hide()
  })
})
