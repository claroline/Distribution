import $ from 'jquery'

$(document).ready(function () {
  $('.claro-oauth').click(function (event) {
    event.preventDefault()
    var form = $('#login-form')
    form.attr('action', $(event.target).attr('href'))
    form.submit()
  })
})
