import details from './../Partials/details.html'

export default function DetailsDirective() {
  return {
    restrict: 'E',
    replace: true,
    controller: 'DetailsCtrl',
    controllerAs: 'detailsCtrl',
    template: details,
    scope: {
      computed: '=',
      dashboard: '=',
      user: '='
    },
    bindToController: true
  }
}
