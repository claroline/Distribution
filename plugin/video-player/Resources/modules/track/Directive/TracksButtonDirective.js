import FacetController from '../Controller/TracksButtonController'

export default class TracksButtonDirective {
  constructor () {
    this.scope = {}
    this.restrict = 'E'
    this.template = require('../Partial/tracks_button.html')
    this.replace = false
    this.controller = TracksButtonController
    this.controllerAs = 'fc'
  }
}
