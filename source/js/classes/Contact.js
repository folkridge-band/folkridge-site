class Contact{
 constructor(){
  this.inputInquiry = document.querySelector('#inputInquiry');
  this.form = document.querySelector('form.form');
  this.localNotice = document.querySelector('#contactLocalNotice');
  /* Automatics */
  this.params = this.grabParams();
  this.changeSelectedInput(this.params);
  this.bindLocalPreview();
 }

 // Jekyll previews cannot receive Netlify Forms submissions.
 bindLocalPreview(){
  const localHosts = ['localhost', '127.0.0.1', '[::1]'];
  if(!localHosts.includes(window.location.hostname) || !this.form || !this.localNotice){
   return;
  }

  this.form.addEventListener('submit', (event)=>{
   event.preventDefault();
   this.localNotice.showModal();
  });

  // The dialog handles keyboard focus and Escape; these close its buttons/backdrop.
  this.localNotice.querySelectorAll('[data-contact-notice-close]').forEach((button)=>{
   button.addEventListener('click', ()=>this.localNotice.close());
  });

  this.localNotice.addEventListener('click', (event)=>{
   if(event.target === this.localNotice){
    this.localNotice.close();
   }
  });
 }

 //Methods
 grabParams(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const bandPackage = urlParams.get('band_package');

  return bandPackage;
 }

 changeSelectedInput(params){

  if(params && this.inputInquiry){
   // Only select and highlight a package that exists in the dropdown.
   const matchingOption = Array.from(this.inputInquiry.options).find(option => option.value === params);
   if(matchingOption){
    this.inputInquiry.value = params;
    this.inputInquiry.classList.add('input--highlight');
   }
  }
  
 }


}
