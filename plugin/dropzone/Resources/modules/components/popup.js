import $ from 'jquery'

$(document).ready(function () {
  'use strict'

  let modalNewForm = null

  $('a.launch-modal').on('click', function (event) {
    event.preventDefault()
    let currentPath = $(this).attr('href')
    $.get(currentPath)
      .always(() => {
        if (modalNewForm !== null) {
          modalNewForm.remove()
        }
      })
      .done(data => {
        $('body').append(data)
        modalNewForm = $('#modal-content')
        modalNewForm.modal('show')

        modalNewForm.on('hidden.bs.modal', () => {
          modalNewForm.remove()
        })
      })
    
  })
})