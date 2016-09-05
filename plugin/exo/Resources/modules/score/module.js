
import angular from 'angular/index'

import ScoreService from './Services/ScoreService'

angular
  .module('Score', [])
  .service('ScoreService', [
    ScoreService
  ])