var mySwiper = new Swiper('.swiper-container', {
 // Optional parameters
 loop: true,

 // Navigation arrows
 navigation: {
  nextEl: '.swiper-button-next',
  prevEl: '.swiper-button-prev',
 },
 autoplay: {
   delay: 2000,
   disableOnInteraction: true,
 }
});