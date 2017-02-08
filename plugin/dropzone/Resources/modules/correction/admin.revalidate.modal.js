import $ from 'jquery'

$(document).ready(function () {
  $('#revalidate_modal_link').click(function (e) {
    e.preventDefault()
    $.ajax($(this).attr('href')).done(function () {
      window.location.reload()
    })
  })
})