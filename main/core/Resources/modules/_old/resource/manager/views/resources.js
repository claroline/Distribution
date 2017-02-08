import _ from 'lodash'
import Breadcrumbs from './resource/breadcrumbs'
import Actions from './resource/actions'
import Nodes from './resource/nodes'
import Backbone from 'backbone'

export default Backbone.View.extend({
  tagName: 'div',
  className: 'tab-pane active',
  outerEvents: {
    'directory-data': 'render'
  },
  initialize: function(parameters, dispatcher) {
    this.parameters = parameters
    this.dispatcher = dispatcher
    this.tabName = 'resources'
    this.wrapper = null
    this.isAppended = false
    this.buildElement()
    _.each(this.outerEvents, (method, event) => {
      this.dispatcher.on(event + '-' + this.parameters.viewName, this[method], this)
    })
  },
  buildElement: function() {
    this.wrapper = this.$el
    this.el.id = this.tabName + '-tab-pane'
    this.$el.attr('role', 'tabpanel')

    this.subViews = {
      breadcrumbs: new Breadcrumbs(this.parameters, this.dispatcher),
      actions: new Actions(this.parameters, this.dispatcher),
      nodes: new Nodes(this.parameters, this.dispatcher)
    }
  },
  render: function() {
    if (!this.isAppended) {
      // this.parameters.parentElement.append(this.$el)

      if (!this.parameters.breadcrumbElement) {
        this.wrapper.append(this.subViews.breadcrumbs.el)
      }

      this.wrapper.append(this.subViews.actions.el)
      this.wrapper.append(this.subViews.nodes.el)

      this.isAppended = true
    }
  }
})
