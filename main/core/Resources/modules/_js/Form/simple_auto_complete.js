import $ from 'jquery'
import 'jquery-ui'

/* global Routing */

$(document).ready(function () {
  var path = window.path
  var field = $(`#${window.formId}`)
  field.addClass('form-control')
  field.after(`<a id="${window.formId}_clear" class="btn btn-default input-group-addon" role="button"i><span class="fa fa-times"></span></a>`)
  $(`#${window.formId}_clear`).on('click', function () {
    field.val('')
  })

  field.autocomplete({
    source: function (request, response) {
      var ajaxConfig = {
        url: path,
        dataType: window.format,
        contentType: 'application/json; charset=utf-8',
        data: {
          search: request.term,
          extra: window.extraDatas
        },
        complete: function (data) {
          if (data.status == 200) {
            var result = eval(data.responseText)
            response(
              $.map(
                result, function (item) {
                  return { label: item.label, value: item.label }
                }
              )
            )
          }
        }
      }

      if ('jsonp' == window.format) {
        ajaxConfig.jsonp = 'extractData'
        ajaxConfig.jsonpCallback = 'extractData'
      }

      $.ajax(ajaxConfig)
    }
  })
})
