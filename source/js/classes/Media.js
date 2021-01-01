class Media{
 constructor(){
  this.images = document.querySelectorAll('.featured-image__asset');
  this.modalOverlay = document.querySelector('#modalOverlay');
  this.modalImg = document.querySelector('#modalImg');
  this.modalImgSrc = document.querySelector('#modalImgSrc');
  this.modalClose = document.querySelector('#modalClose');

  /* Automatic */
  this.bindClose();
 }

 //Methods
 bindOpen(){
  this.images.forEach(image => {
   image.addEventListener('click', (e)=> {
     e.preventDefault();
     
    const imageSrc = e.target.firstElementChild.currentSrc;
    
    this.modalImgSrc.src = imageSrc;
    
    this.modalOverlay.classList.remove('modal--hide');
    this.modalImg.classList.remove('modal--hide');

   });
  });
 }

 bindClose() {
  this.modalClose.addEventListener('click', (e) => {
   e.preventDefault();

   if (e.target.classList.contains('modal-close')) {
    this.modalImg.classList.add('modal--hide');
    this.modalOverlay.classList.add('modal--hide');
   }


  });

  this.modalOverlay.addEventListener('click', (e) => {

   if (e.target.classList.contains('modal-overlay')) {
    this.modalImg.classList.add('modal--hide');
    this.modalOverlay.classList.add('modal--hide');
   }

  });
 }
}