/*global Routing*/
/*global Translator*/
import $ from 'jquery'

const supportUrl = 'https://api.claroline.cloud/cc'

$('#official-support-management-body').on('click', '#support-token-validate-btn', function () {
  const token = $('#support-token-input').val()

  $.ajax({
    url: `${supportUrl}/support/register`,
    type: 'POST',
    data: JSON.stringify({token: token}),
    success: () => {
      $.ajax({
        url: Routing.generate('formalibre_admin_support_token_register'),
        type: 'POST',
        data: {
          'token': token
        }
      })
      $('#token-error-block').html('')
      $('#support-token-form-row').removeClass('has-error')
    },
    error: () => {
      $('#support-token-form-row').addClass('has-error')
      $('#token-error-block').html(Translator.trans('invalid_support_token', {}, 'support'))
    }
  })
})