import $ from 'jquery'

$('#revalidate_modal_link').click(function (e) {
  e.preventDefault()
  $.ajax($(this).attr('href')).done(function () {
    window.location.reload()
  })
})
