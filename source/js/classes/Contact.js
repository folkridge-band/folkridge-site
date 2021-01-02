class Contact{
 constructor(){
  this.inputInquiry = document.querySelector('#inputInquiry');
  /* Automatics */
  this.params = this.grabParams();
  this.changeSelectedInput(this.params);
 }

 //Methods
 grabParams(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const bandPackage = urlParams.get('band_package');

  return bandPackage;
 }

 changeSelectedInput(params){

  if(params){
   this.inputInquiry.value = params;
   this.inputInquiry.classList.add('input--highlight');
  }
  
 }


}