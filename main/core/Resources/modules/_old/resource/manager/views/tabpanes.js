import _ from 'lodash'
import Resources from './resources'
import Widgets from './widgets'
import Backbone from 'backbone'

export default Backbone.View.extend({
  tagName: 'div',
  className: 'tab-content',
  outerEvents: {
    'directory-data': 'render'
  },
  initialize: function(parameters, dispatcher) {
    this.parameters = parameters
    this.dispatcher = dispatcher
    this.wrapper = null
    this.isAppended = false
    this.buildElement()
    _.each(this.outerEvents, (method, event) => {
      this.dispatcher.on(event + '-' + this.parameters.viewName, this[method], this)
    })
  },
  buildElement: function() {
    this.wrapper = this.$el

    this.tabPanes = {
      resources: new Resources(this.parameters, this.dispatcher),
      widgets: new Widgets(this.parameters, this.dispatcher)
    }
  },
  render: function() {
    if (!this.isAppended) {
      // this.parameters.parentElement.append(this.$el)
      this.wrapper.append(this.tabPanes.resources.el)

      if (this.parameters.isTinyMce) {
        this.wrapper.append(this.tabPanes.widgets.el)
      }
      this.isAppended = true
    }
  }
})
