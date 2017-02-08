import $ from 'jquery'

/* global Routing */

var currentTokenId

$('.delete-security-token-btn').on('click', function () {
  currentTokenId = $(this).data('token-id')
  $('#delete-security-token-validation-box').modal('show')
})

$('#delete-security-token-confirm-ok').on('click', function () {
  $('#delete-security-token-validation-box').modal('hide')

  window.location = Routing.generate(
    'claro_admin_security_token_delete',
    {'tokenId': currentTokenId}
  )
})
