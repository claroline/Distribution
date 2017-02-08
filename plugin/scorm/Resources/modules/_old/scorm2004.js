import $ from 'jquery'

$('.check-status-btn').on('click', function () {
  var scoTitle = $(this).data('sco-title')
  var status = $(this).data('status')
  var totalTime = $(this).data('total-time')
  var score = $(this).data('score')


  if (score === undefined) {
    $('#score-tracking-title').addClass('hidden')
    $('#score-tracking-display').addClass('hidden')
  } else {
    $('#score-tracking-title').removeClass('hidden')
    $('#score-tracking-display').removeClass('hidden')
    $('#score-tracking-display').html(score)
  }
  $('#total-time-tracking-display').html(totalTime)
  $('#status-tracking-display').html(status)
  $('#scorm-tracking-modal-title').html(scoTitle)
  $('#scorm-tracking-modal-box').modal('show')
})
