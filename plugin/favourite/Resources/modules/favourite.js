import $ from 'jquery'

/* global Routing */
/* global Translator */

$('.delete-favourite-resource').click(function () {
  var star = $(this)
  var resourceNode = star.parent()
  var resourceNodeId = resourceNode.data('resourceNodeId')
  var routing = Routing.generate('hevinci_delete_favourite', {'node': resourceNodeId})

  $.ajax({
    url: routing,
    type: 'GET',
    complete: function () {
      resourceNode.slideUp('fast', function () {
        if ((resourceNode.parent().children().length)-1 == 1) {
          resourceNode.parent().prepend(`<span><em>${Translator.trans('widget_no_favourite', {}, 'widget')}</em></span>`)
        }
        resourceNode.remove()
      })
    }
  })
})
