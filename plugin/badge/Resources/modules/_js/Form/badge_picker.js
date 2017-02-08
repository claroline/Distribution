import badgePicker from '../../badgePicker'
import $ from 'jquery'
import home from '#/main/core/_old/home/home'

/* global Routing */

var assetPath = home.asset
var callback
var value

$(`#badgepicker_${window.id}`).click(function () {
  if (window.multiple) {
    value = []
    $('.badge-form-collection-element input[type=hidden]').each(function () {
      value.push($(this).val())
    })
    var badgePrototypeField = $(`#${window.id}`).attr('data-prototype')
    var badgeFormCollection = $('.badge-form-collection')

    callback = function (nodes) {
      $('.badge-form-collection-element').remove()

      nodes.each(function (index, element) {
        var newBadge = $(badgePrototypeField.replace(/__name__/g, index))
        badgeFormCollection.append(newBadge)
        $('input', newBadge).val(element.id)
      })
    }
  } else {
    var hiddenInputField = $(`#${window.id}`)
    var badgeSelectionField = $('.badge_selection_field')
    callback = function (nodes) {
      if (0 < nodes.length) {
        var selectedBadge = nodes[0]
        hiddenInputField.val(selectedBadge.id)
        $('.badge_text', badgeSelectionField)
          .html(selectedBadge.text)
          .removeClass('hide')
        $('.badge_image', badgeSelectionField)
          .attr('src', assetPath + selectedBadge.icon)
          .attr('alt', selectedBadge.text)
          .removeClass('hide')
        $('.no_badge_selected').addClass('hide')
        $('.badge_selection_field').removeClass('hide')
      } else {
        hiddenInputField.val(null)
        $('.badge_text', badgeSelectionField)
          .html('')
          .addClass('hide')
        $('.badge_image', badgeSelectionField)
          .attr('src', '')
          .attr('alt', '')
        $('.no_badge_selected').removeClass('hide')
        $('.badge_selection_field').addClass('hide')
      }
    }
    value = hiddenInputField.val()
  }
  var url = Routing.generate('icap_badge_badge_picker')
  var badgePickerSettings = {
    mode: window.mode,
    multiple: window.multiple,
    value: value,
    workspace: window.workspace,
    blacklist: window.blacklist
  }
  badgePicker.configureBadgePicker(url, badgePickerSettings, callback)
  badgePicker.openBadgePicker()
})
