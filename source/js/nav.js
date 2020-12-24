/* Navigation */
class Navigation{
  constructor(openTrigger, closeTrigger, overlay, menu){
    this.openTrigger = openTrigger;
    this.closeTrigger = closeTrigger;
    this.overlay = overlay;
    this.menu = menu;
    
  }

  //Open Nav
  open(){
    this.openTrigger.addEventListener('click', (e) => {
      try {
        this.menu.classList.add('nav--show');
        this.overlay.classList.add('nav--show');

      } catch (err) {
        console.log(err);
      }
    });

  }

  //Close Nav
  close(){ 
    this.closeTrigger.addEventListener('click', (e) => {
      try {
        this.menu.classList.remove('nav--show');

        setTimeout(() => {
          this.overlay.classList.remove('nav--show');
        },300);
        
      } catch (err) {
        console.log(err);
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

  checkWindowOnResize(){
    const MINIMUM = 767;
    
    window.addEventListener('resize', async()=> {
      const windowWidth = await this.getWidth();

      if (windowWidth > MINIMUM) 
        return this.hideNav(this.menu, this.overlay);

      this.stickToTop();
      
    });
    
  }

  hideNav(menu, overlay){
     menu.classList.remove('nav--show');
     overlay.classList.remove('nav--show');
  }

  clickedOutside(){
    const outside = this.overlay;
    
    outside.addEventListener('click', (e)=> {
    if(e.target == outside)
     return this.closeTrigger.click();
    
      
    });
  }

  checkIfSubmenu(){
    const menuItems = document.querySelectorAll('.nav-list__item');
    
    menuItems.forEach(item => {
      if(item.classList.contains('has-submenu')){
        item.addEventListener('click', (e)=> {
          e.preventDefault();
          
          /* Nav Link and Submenu */
          const navLink = item.children[0];
          const submenu = item.children[1];

          /* Checks if clicked element is equals to navlinl */
          if(e.target == navLink)
            return submenu.classList.toggle('submenu--show');
          
        });
      }
    });  
  }


  stickToTop() {
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


}

