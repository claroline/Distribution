
 class CreateDashboardCtrl {
  /**
   * Constructor.
   *
   * @param {object}  workspaces
   */
   constructor($location, DashboardService, workspaces, user, nbDashboards) {
     this.$location = $location
     this.DashboardService = DashboardService
     this.workspaces = workspaces
     this.user = user
     const today = new Date()
     const dashboardDefaultName = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '-' + (nbDashboards + 1)

     // init dashboard
     this.dashboard = {
       name: dashboardDefaultName,
       creatorId: this.user.id,
       workspace:{},
       all:true
     }
     this.currentStep = 1
   }

   setStep(number){
     this.currentStep = number
   }

   saveDashboard(){
     let promise = this.DashboardService.create(this.dashboard)
     promise.then(function(result){
       this.$location.path('/dashboards/' + result.id)
     }.bind(this))
   }
}


 export default CreateDashboardCtrl
