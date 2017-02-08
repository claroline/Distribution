import ObjectiveUtils from './objectiveUtils'
import modal from '#/main/core/_old/modal'
import $ from 'jquery'

/* global Routing */

var utils = new ObjectiveUtils('groups')

// node expansion
$(document).on('click', 'table.group-objectives a.expand:not(.disabled)', function (event) {
  event.preventDefault()
  var link = this
  var row = link.parentNode.parentNode
  var id = row.dataset.id

  if (row.dataset.isLoaded) {
    utils.toggleChildRows(this, false)
  } else {
    $.get(Routing.generate('hevinci_group_objectives', { id: id }))
      .done(function (data) {
        utils.insertChildRows(row, data, 'objective')
        utils.toggleExpandLink(link, true)
        row.dataset.isLoaded = true
      })
      .error(function () {
        modal.error()
      })
  }
})

// node collapsing
$(document).on('click', 'table.group-objectives a.collapse_', function (event) {
  event.preventDefault()
  utils.toggleChildRows(this, true)
})

// remove group objective
$(document).on('click', 'table.group-objectives a.remove', function (event) {
  event.preventDefault()
  utils.removeSubjectObjectiveRow(this, 'group')
})
