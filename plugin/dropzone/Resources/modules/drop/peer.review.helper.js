import $ from 'jquery'

$(document).on('ready', function () {
  $('#peerReview-helper-accordion').on('hide.bs.collapse', () => {
    $('#accordion .fa-angle-down').show()
    $('#accordion .fa-angle-right').hide()
  })
  $('#peerReview-helper-accordion').on('show.bs.collapse', () => {
    $('#accordion .fa-angle-right').show()
    $('#accordion .fa-angle-down').hide()
  })
})