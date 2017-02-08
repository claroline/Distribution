import $ from 'jquery'

$(document).ready(function() {
  $('form[id="deleteChapterForm"] > input[type="submit"]').hide()
  $('form[id="deleteChapterForm"] > a.cancel-btn').hide()
  $('#deleteSubmit').on('click', function(event) {
    event.preventDefault()
        //we keep the "click" on submit button for keep html5 warning
    $('form[id="deleteChapterForm"] > input[type="submit"]').trigger('click')
  })
})
