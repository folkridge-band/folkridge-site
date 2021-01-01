window.addEventListener('DOMContentLoaded', (e)=> {
  
 const bandCardContainer = document.querySelector('.band-card__container');
 const mediaContainer = document.querySelector('.media-container');

 if (isInPage(bandCardContainer)) {
  const modal = new Modal();
  modal.openMemberBio();
 }

 if (isInPage(mediaContainer)) {
  const media = new Media();
  media.bindOpen();
 }

});