import $ from 'jquery'
import table from '#/main/core/_old/table'

let parameters = {}
parameters.route = {}
parameters.route.action = {}
parameters.route.search = {'route': 'claro_forum_search', 'parameters': {'forum': window.forumId }}
table.initialize(parameters)

function highLight (element, text) {
  element.innerHTML = element.innerHTML.replace(new RegExp('(' + text + ')', 'ig'), '<span style="background-color: #FFFF00">$1</span>')
}

$('.message-content').each(function () {
  highLight($(this).get(0), '{{ search }}')
})
