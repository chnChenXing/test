 function getHtmlFontSize() {
     // 1. 获取当前屏幕的宽度
     var windowWidth = document.documentElement.offsetWidth;
     /*320px == 32px
     321 = 32.1
     414px 41.4px*/
     var htmlFontSize = windowWidth / 10;
     document.querySelector('html').style.fontSize = htmlFontSize + 'px';
 }
 getHtmlFontSize();
 window.addEventListener('resize', getHtmlFontSize);
