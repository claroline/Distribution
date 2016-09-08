import match from './../Partials/match.html'

export default function MatchCorrectionDirective() {
  return {
    restrict: 'E',
    replace: true,
    controller: 'MatchCorrectionCtrl',
    controllerAs: 'matchCorrectionCtrl',
    bindToController: true,
    template: match,
    scope: {
      question: '=',
      hideScore: '='
    },
    link: function (scope, element, attr, ctrl) {
      ctrl.init(scope.question, scope.paper)
    }
  }
}
