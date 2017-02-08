import $ from 'jquery'
import moment from 'moment'
import 'bootstrap-daterangepicker'
import 'Datejs'

/* global Translator */

var schoolYear = moment().month() >= 8 ? moment().year() : moment().subtract(1, 'year').year()
var possibleRanges = {
  'today': {
    'value': [
      moment(),
      moment()
    ],
    'label': Translator.trans('date_range.today', {}, 'platform')
  },
  'yesterday': {
    'value': [
      moment().subtract(1, 'days'),
      moment().subtract(1, 'days')
    ],
    'label': Translator.trans('date_range.yesterday', {}, 'platform')
  },
  'this_week': {
    'value': [
      moment().day(parseInt(Translator.trans('date_range.first_day', {}, 'platform'))),
      moment().day(parseInt(Translator.trans('date_range.first_day', {}, 'platform')) + 6)
    ],
    'label': Translator.trans('date_range.this_week', {}, 'platform')
  },
  'last_week': {
    'value': [
      moment().day(parseInt(Translator.trans('date_range.first_day', {}, 'platform'))).subtract(7, 'days'),
      moment().day(parseInt(Translator.trans('date_range.first_day', {}, 'platform')) + 6).subtract(7, 'days')
    ],
    'label': Translator.trans('date_range.last_week', {}, 'platform')
  },
  'this_month': {
    'value': [
      moment().startOf('month'),
      moment().endOf('month')
    ],
    'label': Translator.trans('date_range.this_month', {}, 'platform')
  },
  'last_month': {
    'value': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month')
    ],
    'label': Translator.trans('date_range.last_month', {}, 'platform')
  },
  'this_year': {
    'value': [
      moment().startOf('year'),
      moment().endOf('year')
    ],
    'label': Translator.trans('date_range.this_year', {}, 'platform')
  },
  'last_year': {
    'value': [
      moment().subtract(1, 'year').startOf('year'),
      moment().subtract(1, 'year').endOf('year')
    ],
    'label': Translator.trans('date_range.last_year', {}, 'platform')
  },
  'this_school_year': {
    'value': [
      moment().month(8).year(schoolYear).startOf('month'),
      moment().month(8).year(schoolYear).endOf('month').add(1, 'year').subtract(1, 'month')
    ],
    'label': Translator.trans('date_range.this_school_year', {}, 'platform')
  },
  'last_school_year': {
    'value': [
      moment().month(8).year(schoolYear).startOf('month').subtract(1, 'year'),
      moment().month(8).year(schoolYear).endOf('month').subtract(1, 'month')
    ],
    'label': Translator.trans('date_range.last_school_year', {}, 'platform')
  },
  'last_seven_days': {
    'value': [
      moment().subtract(6, 'days'),
      moment()
    ],
    'label': Translator.trans('date_range.last_seven_days', {}, 'platform')
  },
  'last_thirty_days': {
    'value': [
      moment().subtract(29, 'days'),
      moment()
    ],
    'label': Translator.trans('date_range.last_thirty_days', {}, 'platform')
  }
}

var ranges = {}

for (var i in window.chosenRangeKeys) {
  var key = window.chosenRangeKeys[i]
  var range = possibleRanges[key]
  ranges[range.label] = range.value
}

$(document).ready(function() {
  $(`#${window.formId}`).daterangepicker({
    ranges: ranges,
    separator: ` ${Translator.trans('date_range.separator', {}, 'platform')} `,
    clearClass: 'btn hide',
    locale: {
      format: Translator.trans('date_range.js_format', {}, 'platform'),
      applyLabel: Translator.trans('date_range.apply', {}, 'platform'),
      clearLabel: Translator.trans('date_range.clear', {}, 'platform'),
      fromLabel: Translator.trans('date_range.from', {}, 'platform'),
      toLabel: Translator.trans('date_range.to', {}, 'platform'),
      weekLabel: Translator.trans('date_range.week', {}, 'platform'),
      customRangeLabel: Translator.trans('date_range.custom_range', {}, 'platform'),
      daysOfWeek: JSON.parse(Translator.trans('date_range.day_names', {}, 'platform')),
      monthNames: JSON.parse(Translator.trans('date_range.month_names', {}, 'platform')),
      firstDay: JSON.parse(Translator.trans('date_range.first_day', {}, 'platform'))
    }
  })
})
