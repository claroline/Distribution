function APIClass()
{
  //SCORM 1.2
  this.LMSInitialize = () => {console.log('LMSInitialize')}
  this.LMSFinish = () => {console.log('LMSFinish')}
  this.LMSGetValue = () => {console.log('LMSGetValue')}
  this.LMSSetValue = () => {console.log('LMSSetValue')}
  this.LMSCommit = () => {console.log('LMSCommit')}
  this.LMSGetLastError = () => {console.log('LMSGetLastError')}
  this.LMSGetErrorString = () => {console.log('LMSGetErrorString')}
  this.LMSGetDiagnostic = () => {console.log('LMSGetDiagnostic')}

  //SCORM 2004
  this.Initialize = () => {console.log('Initialize')}
  this.Terminate = () => {console.log('Terminate')}
  this.GetValue = () => {console.log('GetValue')}
  this.SetValue = () => {console.log('SetValue')}
  this.Commit = () => {console.log('Commit')}
  this.GetLastError = () => {console.log('GetLastError')}
  this.GetErrorString = () => {console.log('GetErrorString')}
  this.GetDiagnostic = () => {console.log('GetDiagnostic')}
}

window.API = new APIClass();
window.api = new APIClass();
window.API_1484_11 = new APIClass();
window.api_1484_11 = new APIClass();