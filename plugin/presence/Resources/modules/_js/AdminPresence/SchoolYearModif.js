import $ from 'jquery'

$(document).ready(function () {
  document.getElementById('form_nameModifSchoolYear').defaultValue = window.nameModifSchoolYear
})

$(document).ready(function () {
  document.getElementById('form_beginDateModifSchoolYear').defaultValue = window.beginDateModifSchoolYear
})

$(document).ready(function () {
  document.getElementById('form_endDateModifSchoolYear').defaultValue = window.endDateModifSchoolYear
})

$(document).ready(function () {
  document.getElementById('form_beginHourModifSchoolYear').defaultValue = window.beginHourModifSchoolYear
})

$(document).ready(function () {
  document.getElementById('form_endHourModifSchoolYear').defaultValue = window.endHourModifSchoolYear
})

$(document).ready(function () {
  if (window.current) {
    document.getElementById('form_actualModifSchoolYear').checked = true
  }
})

$(function () {
  $('#form_beginDateModifSchoolYear').datetimepicker({
    format: 'D-M-YYYY',
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
  $('#form_endDateModifSchoolYear').datetimepicker({
    format: 'D-M-YYYY',
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
  $('#form_beginHourModifSchoolYear').datetimepicker({
    format: 'HH:mm',
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
  $('#form_endHourModifSchoolYear').datetimepicker({
    format: 'HH:mm',
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
