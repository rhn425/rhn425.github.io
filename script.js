$(function() {

$(document).on('click','a.page-scroll',function(event){
  var $anchor=$(this);
  $('html,body').stop().animate({
    scrollTop: ($($anchor.attr('href')).offset().top-45)
  },1500,'easeInOutExpo');
  event.preventDefault();
});
});




 $(window).scroll(function() {
    if($(this).scrollTop() > 50)  /*height in pixels when the navbar becomes non opaque*/ 
    {
        $('.opaque-navbar').addClass('opaque');
    } else {
        $('.opaque-navbar').removeClass('opaque');
    }
});