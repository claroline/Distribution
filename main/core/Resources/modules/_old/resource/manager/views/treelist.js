import _ from 'lodash'
import Treenode from './treenode'
import Backbone from 'backbone'

export default Backbone.View.extend({
  tagName: 'ul',
  initialize: function(parameters, dispatcher, data) {
    this.parameters = parameters
    this.dispatcher = dispatcher
    this.items = data.items
    this.itemParameters = _.omit(data, 'items')
    this.wrapper = null
    this.buildElement()
  // this.dispatcher.on(event + '-' + this.parameters.viewName, this[method], this)
  },
  buildElement: function() {
    this.wrapper = this.$el
    this.subViews = []
    for (var i = 0; i < this.items.length; i++) {
      var data = {}
      _.extend(data, this.items[i], this.itemParameters)
      this.subViews.push(new Treenode(this.parameters, this.dispatcher, data))
    }
    if (this.items.length == 0) {
      this.subViews.push(new Treenode(this.parameters, this.dispatcher, null))
    }
    this.render()
  },
  render: function() {
    for (var i = 0; i < this.subViews.length; i++) {
      this.wrapper.append(this.subViews[i].el)
    }
  }
})
