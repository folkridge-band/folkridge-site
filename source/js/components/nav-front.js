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
