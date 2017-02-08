/* global ModalWindow */
/* global Twig */

import Backbone from 'backbone'

export default Backbone.View.extend({
  events: {
    'click #confirm-ok': 'confirm'
  },
  initialize: function(dispatcher) {
    this.dispatcher = dispatcher
    this.callback = null
    this.dispatcher.on('confirm', this.render, this)
    this.dispatcher.on('close-confirm', this.close, this)
  },
  confirm: function() {
    if (this.callback) {
      this.callback()
    }
  },
  close: function() {
    this.$('.modal').modal('hide')
  },
  render: function(event) {
    this.callback = event.callback
    this.$el.html(Twig.render(ModalWindow, {
      header: event.header,
      body: event.body,
      confirmFooter: true,
      modalId: 'confirm-modal'
    }))
    this.$('.modal').modal('show')
  }
})
