$(function() {
  
  // disable 300ms tap delay on mobile browsers
  FastClick.attach(document.body);

  // outdated browser
  outdatedBrowser({
    bgColor: '#444444',
    color: '#ffffff',
    lowerThan: 'transform'
  });

  // // logo animation
  // animatePaths({
  //   paths: document.querySelectorAll('path'),
  //   duration: 3000,
  //   order: 'parallel',
  //   easing: 'easeInOutQuart'
  // });

  // disable scalability with javascript until gesturestart event fires // fixes iPad portrait-to-layout scaling bug
  if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    if (viewportmeta) {
      viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
      document.body.addEventListener('gesturestart', function () {
          viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
      }, false);
    }
  }

  randomHeaderBackground();
  positionElements();

});

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();

function render() {
  var s = $(window).scrollTop(),
          d = $(document).height(),
          c = $(window).height();
          scrollPercent = (s / (d-c)) * 100;

  // console.log("Current scroll percent: " + scrollPercent);
  if (scrollPercent > 100) scrollPercent = 100;
  if (scrollPercent < 0) scrollPercent = 0;
  var newWidth = Math.ceil( $(window).width() * scrollPercent / 100 );
  if (scrollPercent == 100) newWidth = $(window).width();
  // $("#progressBar").css({width: newWidth});
  TweenMax.to($("#progressBar"), .0625, { width:newWidth });
}

// click down arrow
$( "#downArrow" ).click(function(e) {

  var firstRowYPos = $('#firstRow').offset().top;
  TweenLite.to(window, 1.25, {scrollTo:{y:firstRowYPos}, ease:Quint.easeInOut});

});

// listen for window resize
window.addEventListener('resize', function(event) {
  positionElements();
});

// listen for orientation changes
window.addEventListener("orientationchange", function() {
  positionElements();
}, false);

// resize header image on window resize / orientation change
function positionElements() {

  // if scroll position is at the top of the page, resize the header image
  // if ($(window).scrollTop() == 0)
  $("#brandingWrapper").css({height: $(window).height()}); // - 45 (for header height)
  TweenMax.to( $('body'), .5, { autoAlpha:1, delay:.25 } )

}

$("#btcIcon").click(function(){
  window.prompt("My BTC address:", '1JfHv7zbACEiPYXHSdW7JYFqDTESYN96vt');
});

function randomHeaderBackground() {

  var images = [
    // image, background position (horiz, vert), caption
    // ['peace.jpg', 'center bottom', 'NATO Summit, 20 May 2012, Chicago, USA'],
    ['fita.jpg', 'center bottom', 'NATO Summit — 20 May 2012 — Chicago, USA'], // ✔
    ['symbiotic.jpg', 'center bottom', 'Symbiosis — 26 April 2009 — Opoutere, New Zealand'], // ✔
    ['rumination.jpg', 'center center', 'Cao Dai Temple — 24 June 2009 — Tay Nnih, Vietnam'], // ✔
    ['pitch.jpg', 'center top', 'Salesman — 28 June 2009 — Cu Chi, Vietnam'], // ✔
    ['pacifism.jpg', 'center center', 'NATO Summit — 20 May 2012 — Chicago, USA'], // ✔
    ['superhero.jpg', 'center center', 'NATO Summit — 20 May 2012 — Chicago, USA'], // ✔
    ['relation.jpg', 'center bottom', 'Mount Ngauruhoe — 22 April 2009 — Tongariro Crossing, New Zealand'] // ✔
  ];
  var randNum = Math.floor(Math.random() * images.length);
  $('#brandingWrapper').css({'background-image': 'url(images/header/' + images[randNum][0] + ')'});
  $('#brandingWrapper').css({'background-position': images[randNum][1]});
  $( "#headerPhotoCaption" ).text(images[randNum][2]);
  
}

/////////////////////////// HOMESCREEN WEB APP STUFF //

// open new pages in home screen web app on iOS, not in mobile safari
(function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;"href"in d&&(d.href.indexOf("http")||~d.href.indexOf(e.host))&&(a.preventDefault(),e.href=d.href)},!1)}})(document,window.navigator,"standalone")

// black status bar on transparent background hack (http://blog.flinto.com/how-to-get-black-status-bars.html)
if (window.navigator.standalone) {
  $("meta[name='apple-mobile-web-app-status-bar-style']").remove();
}

// allow :active styles to work in your CSS on a page in Mobile Safari
document.addEventListener("touchstart", function(){}, true);

