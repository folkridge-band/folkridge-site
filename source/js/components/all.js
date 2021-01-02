window.addEventListener('DOMContentLoaded', (e)=> {
  
 const bandCardContainer = document.querySelector('.band-card__container');
 const mediaContainer = document.querySelector('.media-container');
 const contactPageTitle = document.querySelector('#contactPageTitle');

 if (isInPage(bandCardContainer)) {
  const modal = new Modal();
  modal.openMemberBio();
 }

 if (isInPage(mediaContainer)) {
  const media = new Media();
  media.bindOpen();
 }

 if (isInPage(contactPageTitle)) {
  const contact = new Contact();

 }
 

});