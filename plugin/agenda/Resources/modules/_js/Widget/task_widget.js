import $ from 'jquery'

/* global Translator */
/* global Routing */

$(document).ready(function () {
  $('.info-of-task').popover({
    html: true
  })

  $('body')
    .on('click', '.mark-task-as-done', function () {
      var $this = $(this)
      var $title = $this.parent().next().find('.info-of-task')
      var contentElements = $.parseHTML($title.attr('data-content'))

      $.ajax({
        url: window.Routing.generate(
          'claro_agenda_set_task_as_done',
          {event: $this.parents('.event-or-task').data('event-id')}
        ),
        type: 'get',
        success: function () {
          $this
            .removeClass('mark-task-as-done fa-square-o')
            .addClass('mark-task-as-not-done fa-check-square-o')
            .attr('title', Translator.trans('mark_task_as_not_done', {}, 'widget'))

          $this.parent().next().css('text-decoration', 'line-through')

          var content = setContent(contentElements, true)
          $title.attr('data-content', content)
        }
      })
    })
    .on('click', '.mark-task-as-not-done', function () {
      var $this = $(this)
      var $title = $this.parent().next().find('.info-of-task')
      var contentElements = $.parseHTML($title.attr('data-content'))

      $.ajax({
        url: Routing.generate(
          'claro_agenda_set_task_as_not_done',
          {event: $this.parents('.event-or-task').data('event-id')}
        ),
        type: 'get',
        success: function () {
          $this
            .addClass('mark-task-as-done fa-square-o')
            .removeClass('mark-task-as-not-done fa-check-square-o')
            .attr('title', Translator.trans('mark_task_as_not_done', {}, 'widget'))

          $this.parent().next().css('text-decoration', 'none')

          var content = setContent(contentElements, false)
          $title.attr('data-content', content)
        }
      })
    })
})

function setContent (contentElements, isTaskDone) {
  var content = ''
  var nbContentElements = contentElements.length

  contentElements.forEach(function (element, index) {
    if (nbContentElements - 2 == index) {
      if (isTaskDone) {
        content += `<div style='background-color: darkgreen; color: #f5f5f5; text-align: center; padding: 5px 0;'><span class='fa fa-check-circle'></span> ${Translator.trans('task_done', {}, 'agenda')} </div>`
      } else {
        content += `<div style='background-color: darkred; color: #f5f5f5; text-align: center; padding: 5px 0;'><span class='fa fa-exclamation-circle'></span> ${Translator.trans('task_not_done', {}, 'agenda')} </div>`
      }
      return
    }
    content += element.nodeType === 1 ? element.outerHTML : element.nodeValue
  })
  return content
}
