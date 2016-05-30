import angular from 'angular/index'

angular
  .module('claroFilters', [])
  .filter('trans',
    () => (text, domain = 'platform', vars = {}) => {return (window.Translator) ? window.Translator.trans(text, vars, domain) : text})
  .filter('trustAsHtml', ['$sce', $sce => text => $sce.trustAsHtml(text)])
  .filter('path', () => (name, params = {}) => {return (window.Routing) ? window.Routing.generate(name, params) : name})
  .filter('asset', () => (url) => {return ((window.Claroline && window.Claroline.Home && window.Claroline.Home.asset)? window.Claroline.Home.asset : '') + url})