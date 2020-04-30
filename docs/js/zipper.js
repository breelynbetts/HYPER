window.onscroll = function() {scrollFunction()};
//Nav JS
function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    document.getElementById("tm-nav-id").style.background = "#000000b2";
    document.getElementById("nav-txt").style.fontSize = "18px";
  } else {
    document.getElementById("tm-nav-id").style.background = "#00000070";
    document.getElementById("nav-txt").style.fontSize = "20px";
  }
}