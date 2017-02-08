import $ from 'jquery'

const widgetInstanceId = window.widgetInstanceId
const widgetElement = $(`#announcement-widget-${widgetInstanceId}`)
const listElement = $(`#announcements-list-${widgetInstanceId}`)

widgetElement.on('click', '.pagination > ul > li > a', function (event) {
  event.preventDefault()
  const element = event.currentTarget
  const url = $(element).attr('href')

  $.ajax({
    url: url,
    type: 'GET',
    success: function (datas) {
      listElement.html(datas)
    }
  })
})
