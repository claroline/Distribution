import clarolineTinymce from 'claroline/tinymce'

export default function($scope, portfolioManager, commentsManager) {
  $scope.message = ''

  $scope.tinyMceConfig = clarolineTinymce.getConfiguration()
  $scope.tinyMceConfig.format = 'text'

  $scope.create = function() {
    if (this.message) {
      commentsManager.create(portfolioManager.portfolioId, {
        'message' : this.message
      })
      this.message = ''
    }
  }

  $scope.updateCountViewComments = function() {
    $scope.displayComment= !$scope.displayComment

    if ($scope.displayComment) {
      if (0 < portfolioManager.portfolio.unreadComments) {
        portfolioManager.updateViewCommentsDate()
      }
    }
  }
}
