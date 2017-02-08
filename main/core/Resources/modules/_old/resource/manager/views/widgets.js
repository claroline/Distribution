import Treelist from './treelist'
import Backbone from 'backbone'

export default Backbone.View.extend({
  tagName: 'div',
  className: 'tab-pane widget-tree',
  initialize: function(parameters, dispatcher) {
    this.parameters = parameters
    this.dispatcher = dispatcher
    this.tabName = 'widgets'
    this.wrapper = null
    this.isAppended = false
    this.buildElement()
    this.dispatcher.on('widgets-tab-pane-visible', this.getWorkspaces, this)
    this.dispatcher.on('workspace-list-returned', this.render, this)
  },
  buildElement: function() {
    this.wrapper = this.$el
    this.el.id = this.tabName + '-tab-pane'
    this.$el.attr('role', 'tabpanel')
  },
  getWorkspaces: function() {
    if (!this.isAppended) {
      this.dispatcher.trigger('get-workspace-list')
    }
  },
  render: function(data) {
    if (!this.isAppended) {
      this.subViews = {
        workspaces: new Treelist(this.parameters, this.dispatcher, data)
      }

      this.wrapper.append(this.subViews.workspaces.el)

      this.isAppended = true
    }
  }
})
