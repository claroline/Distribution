import $ from 'jquery'

/* global Routing */

$('.ok-btn').on('click', function () {
  var presenceId = $(this).data('presence-id')
  $.ajax({
    url: Routing.generate('formalibre_presence_supp_validate', {'id': presenceId}),
    type: 'GET',
    async: false,
    success: function () {
      window.parent.location.reload()
    }
  })
})
