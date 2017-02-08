import $ from 'jquery'
import modal from '#/main/core/_old/modal'

/* global Routing */

$(function () {
  $('#form_startMod').datetimepicker({
    format: 'LT',
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-arrow-up',
      down: 'fa fa-arrow-down'
    }
  })
})

$(function () {
  $('#form_endMod').datetimepicker({
    format: 'LT',
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-arrow-up',
      down: 'fa fa-arrow-down'
    }
  })
})

$('#supprimer-btn').on('click', function () {
  var periodId = $(this).data('period-id')
  modal.confirmRequest(
    Routing.generate('formalibre_period_supprimer', {'period': periodId}),
    function () {
      window.location.reload()
    },
    periodId,
    'Etes-vous certain de vouloir supprimer cette tranche horaire ? Cela effacera également toutes les présences liées.',
    'Supression tranche horaire'
  )
})
