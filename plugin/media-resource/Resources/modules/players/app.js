import angular from 'angular/index'
import 'angular-loading-bar'
import 'angular-ui-translation/angular-translation'
import '#/main/core/fos-js-router/module'
import '../shared/module'
import '../modals/module'
// component
import scriptedTpl from './scripted/Partials/scripted.html'
import ScriptedCtrl from './scripted/Controllers/ScriptedCtrl'
import activeTpl from './active/Partials/active.html'
import ActiveCtrl from './active/Controllers/ActiveCtrl'
import liveTpl from './live/Partials/live.html'
import LiveCtrl from './live/Controllers/LiveCtrl'
import pauseTpl from './pause/Partials/pause.html'
import PauseCtrl from './pause/Controllers/PauseCtrl'
import FreeCtrl from './free/Controllers/FreeCtrl'
import freeTpl from './free/Partials/free.html'
import PanelHeaderCtrl from './panelHeader/Controllers/PanelHeaderCtrl'
import panelHeaderTpl from './panelHeader/Partials/panel-header.html'

let players = angular.module('PlayersApp', [
  'angular-loading-bar',
  'ui.translation',
  'ui.fos-js-router',
  'Shared',
  'Modals'
])

players.config([
  'cfpLoadingBarProvider',
  function appConfig(cfpLoadingBarProvider) {
    // Configure loader
    cfpLoadingBarProvider.latencyThreshold = 200
    cfpLoadingBarProvider.includeBar       = false
    cfpLoadingBarProvider.spinnerTemplate  = '<div class="loading">Loading&#8230;</div>'
  }
])


// panel header comp
players.component('header', {
  template: panelHeaderTpl,
  bindings: {
    resource: '='
  },
  controller: PanelHeaderCtrl
})

// live comp
players.component('live', {
  template: liveTpl,
  bindings: {
    resource: '='
  },
  controller: LiveCtrl
})

// active comp
players.component('active', {
  template: activeTpl,
  bindings: {
    resource: '='
  },
  controller: ActiveCtrl
})

// scripted comp
players.component('scripted', {
  template: scriptedTpl,
  bindings: {
    resource: '='
  },
  controller: ScriptedCtrl
})

// auto-pause comp
players.component('pause', {
  template: pauseTpl,
  bindings: {
    resource: '='
  },
  controller: PauseCtrl
})

// scripted comp
players.component('free', {
  template: freeTpl,
  bindings: {
    resource: '='
  },
  controller: FreeCtrl
})
