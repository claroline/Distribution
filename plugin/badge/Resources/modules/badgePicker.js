import $ from 'jquery'

var modalElement = $('.badge_picker_modal')
var multipleSelection = $('.badge_picker_list').data('multiple')

$('.badge_picker_item').click(function () {
  manageMultipleSelection(this)
  toggleBadgeSelection(this)
})

function manageMultipleSelection (badge) {
  if (!multipleSelection && !$(badge).hasClass('selected')) {
    var selectedBadges = $('.badge_picker_item.selected', modalElement)

    var checkboxes = $('input[type=checkbox]', modalElement)
    checkboxes.prop('checked', false)

    selectedBadges.removeClass('selected')
  }
}

function toggleBadgeSelection (badge) {
  $(badge).toggleClass('selected')
  var checkbox = $('input[type=checkbox]', badge)
  checkbox.prop('checked', !checkbox.prop('checked'))
}
