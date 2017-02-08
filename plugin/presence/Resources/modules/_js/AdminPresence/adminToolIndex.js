import $ from 'jquery'
import modal from '#/main/core/_old/modal'
import 'mjolnic-bootstrap-colorpicker'
import 'moment'
import 'eonasdan-bootstrap-datetimepicker'

/* global Routing */

$('.rightCheckbox').on('change', function () {
  var rightId = $(this).data('right-id')
  var name = $(this).data('one-name')

  $.ajax({
    url: Routing.generate('formalibre_presence_admin_right', {'right': rightId,'rightValue': name}),
    type: 'POST'
  })
})
$(function () {
  $('#form_color').colorpicker()
})

$('.modifier-status-btn').on('click', function () {
  var statusId = $(this).data('status-id')
  modal.displayForm(
    Routing.generate('formalibre_status_modif', {'theStatus': statusId}),
    function () {
      window.location.reload()
    },
    function () {}
  )
})

$('.supprimer-status-btn').on('click', function () {
  var statusId = $(this).data('status-id')
  modal.confirmRequest(
    Routing.generate('formalibre_status_supprimer', {'theStatus': statusId}),
    function () {
      window.location.reload()
    },
    statusId,
    'Etes-vous certain de vouloir supprimer ce status ?',
    'Supression status'
  )
})

$(function () {
  $('#form_beginHour').datetimepicker({
    format: 'HH:mm',
    locale: 'fr',
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-arrow-up',
      down: 'fa fa-arrow-down'
    }
  })
})

$(function () {
  $('#form_endHour').datetimepicker({
    format: 'HH:mm',
    locale: 'fr',
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-arrow-up',
      down: 'fa fa-arrow-down'
    }
  })
})

$(function () {
  $('#form_beginDate').datetimepicker({
    format: 'D-M-YYYY',
    locale: 'fr',
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-arrow-up',
      down: 'fa fa-arrow-down',
      next: 'fa fa-arrow-right',
      previous: 'fa fa-arrow-left'
    }
  })
})

$(function () {
  $('#form_endDate').datetimepicker({
    format: 'D-M-YYYY',
    locale: 'fr',
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-arrow-up',
      down: 'fa fa-arrow-down',
      next: 'fa fa-arrow-right',
      previous: 'fa fa-arrow-left'
    }
  })
})

$('.modifier-schoolYear-btn').on('click', function () {
  var schoolYearId = $(this).data('school-year-id')
  modal.displayForm(
    Routing.generate('formalibre_school_year_modif', {'theSchoolYear': schoolYearId}),
    function () {
      window.location.reload()
    },
    function () {}
  )
})

$('.supprimer-schoolYear-btn').on('click', function () {
  var schoolYearId = $(this).data('school-year-id')
  modal.confirmRequest(
    Routing.generate('formalibre_school_year_supprimer', {'theSchoolYear': schoolYearId}),
    function () {
      window.location.reload()
    },
    schoolYearId,
    'Etes-vous certain de vouloir supprimer cette année ? Cela effacera également les presences liées à cette année.',
    'Supression année'
  )
})
