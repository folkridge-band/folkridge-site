class Modal{
 constructor(){
  this.bandBio = document.querySelector('#bandBio');
  this.bandName = document.querySelector('#bandName');
  this.modal = document.querySelector('#modal');
  this.modalClose = document.querySelector('#modalClose');
  this.modalOverlay = document.querySelector('#modalOverlay');

  /* Automatic */
  this.bindClose();
 }

 //Methods
 openMemberBio(){
  const buttons = document.querySelectorAll('.band-card__btn');

  buttons.forEach(button => {
   button.addEventListener('click', (e)=> {
     e.preventDefault();
     const biography = e.target.previousElementSibling.innerHTML;
     const name = e.target.dataset.bandName.split(' ')[0];

     this.bandBio.innerHTML = biography;
     this.bandName.innerHTML = `${name}\'s Biography`;

     this.modal.classList.remove('modal--hide');
     this.modalOverlay.classList.remove('modal--hide');

   });
  });
 }

  bindClose(){
   this.modalClose.addEventListener('click', (e)=> {
     e.preventDefault();
    if(e.target.classList.contains('modal-close')){
     this.modal.classList.add('modal--hide');
     this.modalOverlay.classList.add('modal--hide');
    }
    
   });

   this.modalOverlay.addEventListener('click', (e) => {
    
    if (e.target.classList.contains('modal-overlay')){
     this.modal.classList.add('modal--hide');
     this.modalOverlay.classList.add('modal--hide');
    }

   });
  }
}