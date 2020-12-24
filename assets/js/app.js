/* Notes:
  <a> should always be the one clickable having a full height and width

  always use max-height to transition height
*/

class Menuet {
 constructor({nav, openTrigger, closeTrigger, overlay, subMenus}) {
   this.nav = nav;
   this.openTrigger = openTrigger;
   this.overlay = overlay;
   this.closeTrigger = closeTrigger;
   this.subMenus = subMenus
   this.header = document.querySelector('header');
   this.body = document.querySelector('body');
   
   //Automatic runs these functions
   this.open();
   this.close();
   this.checkIfSubmenu();
   this.stick();
 }

 // Properties
 
 open(){
    this.openTrigger.addEventListener('click', (e) => {   
      try {
        this.nav.classList.add('nav--show');
        this.overlay.classList.add('nav--show');

      } catch (err) {
        console.log(err);
      }
    });
 }

 close(){
  this.overlay.addEventListener('click', (e) => {
    if (e.target == this.overlay || e.target == this.closeTrigger) {
      try {
        this.nav.classList.remove('nav--show');

        setTimeout(() => {
          this.overlay.classList.remove('nav--show');
        }, 300);

      } catch (err) {
        console.log(err);
      }
    }
  });
 }

 getWidth() {
   const width = window.innerWidth;
   return new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(width);
     }, 50);
   });

 }

 checkWindowOnResize() {
   const MINIMUM = 767;

   window.addEventListener('resize', async () => {
     const windowWidth = await this.getWidth();

     if (windowWidth > MINIMUM)
       return this.hideNav(this.nav, this.overlay);

     this.stick();

   });

 }

 hideNav(menu, overlay) {
   menu.classList.remove('nav--show');
   overlay.classList.remove('nav--show');
 }

stick() {
  const MINIMUM = 767;
  const SCREEN_BREAKPOINT = 25;
  const header = document.querySelector('header');


  window.addEventListener('scroll', () => {
    const screenVertical = window.scrollY;
    const windowWidth = window.innerWidth;

    /* Checks if screen Vertical is equal to breakpoint
       if false it removes header--fixed class
    */
    /* if(windowWidth < MINIMUM) {
      if (screenVertical > SCREEN_BREAKPOINT) {
        header.classList.add('header--fixed');
        console.log(windowWidth);
      } else {
        header.classList.remove('header--fixed');
      }
    } */

    if (windowWidth > MINIMUM) return
    if (screenVertical > SCREEN_BREAKPOINT) return header.classList.add('header--fixed')
    return header.classList.remove('header--fixed')

  });
}

  checkIfSubmenu() {
    const menuItems = document.querySelectorAll('.nav-list__item');

    menuItems.forEach(item => {
      if (item.classList.contains('has-submenu')) {
        item.addEventListener('click', (e) => {
          
          /* Nav Link and Submenu */
          const navLink = item.children[0];
          const submenu = item.children[1];
          

          /* Checks if clicked element is equals to navlinl */
          if (e.target == navLink)
            e.preventDefault();

             if (window.innerWidth <= 800) 
              return submenu.classList.toggle('submenu--show');

        });
      }
    });
  }

 toggleSubmenu(e, action) {
   /* Assuming <a> is the clicked Element */
   const clickedElement = e.target;
   const parent = clickedElement.offsetParent;

   e.preventDefault();

   if (parent.classList.contains('menu-item-has-children')) {
     const ul = clickedElement.nextElementSibling;
     ul.classList.toggle('sub-menu--show');
   }
 }

 /* Checks if device is mobile */
 isMobile() {
   if (navigator.userAgent.match(/Android/i) ||
     navigator.userAgent.match(/webOS/i) ||
     navigator.userAgent.match(/iPhone/i) ||
     navigator.userAgent.match(/iPad/i) ||
     navigator.userAgent.match(/iPod/i) ||
     navigator.userAgent.match(/BlackBerry/i) ||
     navigator.userAgent.match(/Windows Phone/i))

     return true;
 }

}



const navOpen = document.querySelector('#navOpen');
const navOverlay = document.querySelector('#navOverlay');
const navClose = document.querySelector('#navClose');
const nav = document.querySelector('#nav');
const subMenus = document.querySelectorAll('.menu-item-has-children');

//Instantiate
const menuet = new Menuet({
 nav: nav,
 openTrigger: navOpen,
 closeTrigger: navClose,
 overlay: navOverlay,
 subMenus: subMenus
});

//Display output

var mySwiper = new Swiper('.swiper-container', {
 // Optional parameters
 loop: true,

 // Navigation arrows
 navigation: {
  nextEl: '.swiper-button-next',
  prevEl: '.swiper-button-prev',
 }

});
// require ('bootstrap');
