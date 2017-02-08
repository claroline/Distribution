import $ from 'jquery'

$(document).ready(function () {
  $('a.cancel-inline').bind('click', function(event) {
    event.preventDefault()

    $('.container-inline').empty()
    $('.show-during-add').hide()
    $('.disabled-during-add').removeAttr('disabled')
  })
})