var picker = {}

import $ from 'jquery'
import _ from 'lodash'

import common from './common'
import modal from './modal'

import manager from 'claroline/resource-manager'

/* global Routing */

var activePicker = null

var defaultCallback = function(nodes) {
  var nodeId = _.keys(nodes)[0]
  var name = nodes[_.keys(nodes)][0]
  var type = nodes[_.keys(nodes)][1]
  $(activePicker).prev().val(nodeId)
  $(activePicker).prev().data('name', name)
  $(activePicker).prev().data('type', type)
  $(activePicker).prev().trigger('change')
  $('input', activePicker).val(name)
  checkView()
}

/**
 * Initializes every resource input on the page.
 */
picker.initialize = function(id) {
  var pickerName = 'formResourcePicker'
  var field = $('#' + id)
  var element = field.next('.input-group')

  $('input.form-control', element)
    .on('focus', function() {
      activePicker = this.parentNode
      openPicker(pickerName, customParameters)
    })

  var inputGroupButton = $('.input-group-btn', element)

  $('button.resource-browse', inputGroupButton)
    .on('click', function() {
      activePicker = this.parentNode.parentNode
      openPicker(pickerName, customParameters)
    })

  $('button.resource-download', inputGroupButton)
    .on('click', function() {
      activePicker = this.parentNode.parentNode
      modal.fromRoute('claro_upload_modal', null, function(element) {
        element.on('click', '.resourcePicker', function() {
          openPicker(pickerName, customParameters)
        })
          .on('click', '.filePicker', function() {
            $('#file_form_file').click()
          })
          .on('change', '#file_form_file', function() {
            common.uploadfile(this, element, defaultCallback)
          })
      })
    })

  var customParameters = processCustomParameters(field.data())

  var name = field.data('name')

  if (name) {
    $('input', element).val(name)
  }

  if (field.next().hasClass('help-block')) {
    field.next().appendTo(element)
  }

  field.addClass('resource-picker-done').addClass('hide')
  checkView(element)
}

function processCustomParameters(datas) {
  var customParameters = null

  var simpleParameterList = [
    'restrictForOwner',
    'isPickerMultiSelectAllowed',
    'isDirectorySelectionAllowed'
  ]
  var arrayParameterList = [
    'typeBlackList',
    'typeWhiteList'
  ]

  for (let i = 0; i < simpleParameterList.length; i++) {
    var simpleParameterName = simpleParameterList[i]
    if (undefined !== datas[simpleParameterName]) {
      customParameters = customParameters || {}
      customParameters[simpleParameterName] = datas[simpleParameterName]
    }
  }

  for (let i = 0; i < arrayParameterList.length; i++) {
    var arrayParameterName = arrayParameterList[i]
    if (undefined !== datas[arrayParameterName]) {
      customParameters = customParameters || {}
      customParameters[arrayParameterName] = datas[arrayParameterName].split(',')
    }
  }

  return customParameters
}

/**
 * Opens a resource picker.
 */
function openPicker(pickerName, customParameters) {
  if (!manager.hasPicker(pickerName)) {
    var parameters = {
      callback: defaultCallback
    }

    if (customParameters) {
      _.keys(customParameters).forEach(function(parameter) {
        parameters[parameter] = customParameters[parameter]
      })
    }

    manager.createPicker(pickerName, parameters, true)
  } else {
    manager.picker(pickerName, 'open')
  }
}

/**
 * Checks if a resource was selected and if so, enables the "view" button
 */
function checkView(targetPicker) {
  activePicker = targetPicker || activePicker

  var nodeId = $(activePicker).prev().val()
  var type = $(activePicker).prev().data('type')

  if (nodeId && type) {
    $('.resource-view', activePicker).removeClass('disabled').attr(
      'href',
      Routing.generate('claro_resource_open', {
        resourceType: type,
        node: nodeId
      })
    )
  } else {
    $('.resource-view', activePicker).attr('href', '').addClass('disabled')
  }
}

export default picker
