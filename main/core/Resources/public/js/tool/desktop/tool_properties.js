/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* global $, Routing */

(function() {
  const type = $('#datas-box').data('type')

  $('#edit-tools-btn').on('click', function(e) {
    e.preventDefault()
    let formData = new FormData(document.getElementById('desktop-tool-form'))
    const url = $('#desktop-tool-form').attr('action')

    $('#tool-table tr').each(function(index) {
      if ($(this).attr('data-tool-id')) {
        formData.append('tool-' + $(this).attr('data-tool-id'), index)
      }
    })

    $.ajax({
      url: url,
      data: formData,
      type: 'POST',
      processData: false,
      contentType: false,
      success: function() {
        window.location.reload()
      }
    })
  })

  $('#tools-table-body').sortable({
    items: '.row-tool-config',
    cursor: 'move'
  })

  $('#tools-table-body').on('sortupdate', function(event, ui) {
    if (this === ui.item.parents('#tools-table-body')[0]) {
      const orderedToolId = $(ui.item).data('ordered-tool-id')
      let nextOrderedToolId = -1
      const nextElement = $(ui.item).next()

      if (nextElement !== undefined && nextElement.hasClass('row-tool-config')) {
        nextOrderedToolId = nextElement.data('ordered-tool-id')
      }

      $.ajax({
        url: Routing.generate('claro_desktop_update_ordered_tool_order', {
          'orderedTool': orderedToolId,
          'nextOrderedToolId': nextOrderedToolId,
          'type': type
        }),
        type: 'POST'
      })
    }
  })
})()
