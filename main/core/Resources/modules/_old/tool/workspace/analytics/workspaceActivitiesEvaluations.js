import $ from 'jquery'

$('.display-past-evaluations-link').on('click', function (e) {
  e.stopImmediatePropagation()
  e.preventDefault()

  var route = $(this).attr('href')

  $.ajax({
    url: route,
    type: 'GET',
    success: function (datas) {
      $('#activity-past-evaluations-modal-body').empty()
      $('#activity-past-evaluations-modal-body').html(datas)
    }
  })
  $('#activity-past-evaluations-modal-box').modal('show')
})

$('.display-comment').popover()
