import dashboards from './../Partials/dashboards.html'

/**
 * Exercise Directive
 * Displays the summary of the Exercise and the links to the available actions for current User
 * @constructor
 */
export default function DashboardsDirective() {
  return {
    restrict: 'E',
    replace: true,
    controller: 'DashboardsCtrl',
    controllerAs: 'dashboardsCtrl',
    template: dashboards,
    scope: {
      dashboards     : '@', // The current Exercise to display
    },
    bindToController: true
  }
}
