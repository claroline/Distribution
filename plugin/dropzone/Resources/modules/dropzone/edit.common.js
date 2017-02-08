import $ from 'jquery'
import '../components/tooltip'

$('document').ready(function() {

  $('#expected-total-correction-explication, .popoverItem').popover({
    'trigger': 'hover',
    'html': true
  })

  $('input:radio[name="icap_dropzone_common_form[manualState]"]').click(function()
  {
    onManualStateChange($(this))
  })

  $('#icap_dropzone_common_form_stayHere').val(0)
  if (window.dropzone.peerReview) {
    $('#icap_dropzone_common_form_peerReview_1').prop('checked', true)
  } else {
    $('#icap_dropzone_common_form_peerReview_0').prop('checked', true)
  }
  $('#icap_dropzone_common_form_autoCloseForManualStates').val(0)
  $('.save-button').on('click', function(event) {
    event.preventDefault()
    $('#icap_dropzone_common_form_stayHere').val(1)
    $('.submit_button').trigger('click')
  })

  $('#icap_dropzone_common_form_peerReview_0').on('click', function() {
    enablePeerReviewOptions(false)
  })
  $('#icap_dropzone_common_form_peerReview_1').on('click', function() {
    enablePeerReviewOptions(true)
  })

  const $displayNotationToLearner = $('#icap_dropzone_common_form_displayNotationMessageToLearners')
  manageSuccessFailMessagesVisibility($displayNotationToLearner)
  $displayNotationToLearner.change(function () {
    manageSuccessFailMessagesVisibility($(this))
  })


  const enablePeerReviewOptions = function (peerReviewEnabled) {
    if (peerReviewEnabled) {
      // show the peerReview options
      $('.peer-review-options').show()
      // hide the manuals options.
      $('.manual-review-option').hide()
      $('#icap_dropzone_common_form_manualState_2').parent().show()
      $('#icap_dropzone_common_form_manualState_3').parent().show()
      $('#icap_dropzone_common_form_diplayCorrectionsToLearners').show()
      $('#dropzone_notification_part').hide()
      $('.submit_button').html(window.Translator.trans('Save and continue', {}, 'icap_dropzone'))
    } else {
      // hide the peerReview options
      $('.peer-review-options').hide()
      //show the manuals options
      $('.manual-review-option').show()
      $('#icap_dropzone_common_form_manualState_2').parent().hide()
      $('#icap_dropzone_common_form_manualState_3').parent().hide()

      const $expectedTotalCorrection = $('#icap_dropzone_common_form_expectedTotalCorrection')
      if ($expectedTotalCorrection.val() < 1 || $expectedTotalCorrection.val() > 10) {
        $expectedTotalCorrection.val(3)
      }
      $('#icap_dropzone_common_form_endReview_date').val(null)
      $('#icap_dropzone_common_form_endReview_time').val(null)
      $('#icap_dropzone_common_form_startReview_date').val(null)
      $('#icap_dropzone_common_form_startReview_time').val(null)

      $('#dropzone_notification_part').show()

      $('.submit_button').html(window.Translator.trans('Save and finished', {}, 'icap_dropzone'))

    }
    manageCorrectionVisibility()
  }

  enablePeerReviewOptions(window.dropzone.peerReview)

  const manualPlanning = function () {

    const $planning_dates = $('#planning_dates')
    $planning_dates.addClass('text-muted')
    $planning_dates.find('input').prop('disabled', true)

    const $planning_manual = $('#planning_manual')
    $planning_manual.removeClass('text-muted')
    $planning_manual.find('input').prop('disabled', false)
  }

  const datesPlanning = function () {
    const $planning_manual = $('#planning_manual')
    $planning_manual.addClass('text-muted')
    $planning_manual.find('input').prop('disabled', true)

    const $planning_dates = $('#planning_dates')
    $planning_dates.removeClass('text-muted')
    $planning_dates.find('input').prop('disabled', false)
  }

  $('#icap_dropzone_common_form_manualPlanning_0').on('click', manualPlanning)
  $('#icap_dropzone_common_form_manualPlanning_1').on('click', datesPlanning)

  if (window.dropzone.manualPlanning) {
    $('#icap_dropzone_common_form_manualPlanning_0').prop('checked', true)
    manualPlanning()
  } else {
    $('#icap_dropzone_common_form_manualPlanning_1').prop('checked', true)
    datesPlanning()
  }

  $('#icap_dropzone_common_form_diplayCorrectionsToLearners').click(function()
  {
    manageCorrectionDeny()
  })

  $('#editCriteriaLink').click(function (e) {
    e.preventDefault()
    $('#submitAndGotoCriteriaButton').trigger('click')
  })
})

function manageCorrectionDeny()
{
  // Set manageCorrectionDeny dependencies
  // show option only if peerReview and CorrectionVisibility are Activated, set to false and desactivate if they are  not.
  if($('#icap_dropzone_common_form_peerReview_1:checked').length == 1
    && $('#icap_dropzone_common_form_diplayCorrectionsToLearners').prop('checked')) {
    $('#allow-correction-deny').parent().show()
  } else {
    $('#icap_dropzone_common_form_allowCorrectionDeny').prop('checked',false)
    $('#allow-correction-deny').parent().hide()
  }

}

function manageCorrectionVisibility()
{
  // Set PeerReview dependency
  // show option only if peerReview is Activated, set to false and desactivate if it is not.
  // call manageCorrectionDeny to cascade dependencies .
  $('#icap_dropzone_common_form_diplayCorrectionsToLearners').parent().show()
  manageCorrectionDeny()
}

function manageSuccessFailMessagesVisibility($cb)
{
  const $div = $('#dropzone-message-part')
  if($cb.prop('checked')) {
    $div.fadeIn()
  }else {
    $div.fadeOut()
  }
}

/**
 * When manual state has changed and involve that poeple will not be able to drop anymore, this will ask if
 * you want to close opened drop. ( same as autoClose when time is up ).
 *
 * @param $radio (jquery selected item)
 */
function onManualStateChange($radio)
{
  const val = $radio.val()
  $('#icap_dropzone_common_form_autoCloseForManualStates').val(0)
  if(val == 'finished' || val == 'peerReview' ) {
    $('#autoClosePrompt').modal('show') // call the modal dialog.
    $('#acitvate_manualStateAutoClose').unbind('click').click(function(e) {
      e.preventDefault()
      $('#icap_dropzone_common_form_autoCloseForManualStates').val(1)
      $('#autoClosePrompt').modal('hide')
    })
  }
}