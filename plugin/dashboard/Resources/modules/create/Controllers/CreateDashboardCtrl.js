
 class CreateDashboardCtrl {
  /**
   * Constructor.
   *
   * @param {object}  workspaces
   */
   constructor(workspaces, user) {
     this.workspaces = workspaces
     this.user = user
     const today = new Date()

     // init dashboard
     this.dashboard = {
       name: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
       creator: user,
       workspace:{}
     }
     this.currentStep = 1
     console.log(this.user)
     console.log(this.workspaces)
   }

   setStep(number){
     this.currentStep = number
   }
}


 export default CreateDashboardCtrl
