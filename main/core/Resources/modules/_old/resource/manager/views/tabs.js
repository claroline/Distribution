import _ from 'lodash'
import $ from 'jquery'
import Backbone from 'backbone'

/* global Twig */
/* global ResourceManagerTabs */

export default Backbone.View.extend({
  tagName: 'ul',
  className: 'nav nav-tabs',
  outerEvents: {
    'directory-data': 'render'
  },
  events: {
    'shown.bs.tab a.tab-btn': 'tabChanged'
  },
  initialize: function(parameters, dispatcher) {
    this.parameters = parameters
    this.dispatcher = dispatcher
    this.isAppended = false
    this.tabs = ['resources', 'widgets']
    this.buildElement()
    _.each(this.outerEvents, (method, event) => {
      this.dispatcher.on(event + '-' + this.parameters.viewName, this[method], this)
    })
  },
  buildElement: function() {
    this.$el.attr('role', 'tablist')
  },
  tabChanged: function(event) {
    this.dispatcher.trigger($(event.target).attr('aria-controls') + '-visible')
  },
  render: function() {
    if (!this.isAppended) {
      this.$el.html(Twig.render(ResourceManagerTabs, {
        tabs: this.tabs
      }))

      this.isAppended = true
    }
  }
})
