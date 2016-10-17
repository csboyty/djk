
$(document).ready(function(){


    $('#carousel').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 210,
        itemMargin: 5,
        asNavFor: '#slider'
    });

    $('#slider').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        sync: "#carousel"
    });

    $('#carousel1').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        itemWidth: 200,
        itemMargin: 5
    });


    var timer=null;
    var el=$(".aside");
    var scrollTop=0;
    $(window).scroll(function(){
        if(timer){
            clearTimeout(timer);
            timer=null;
        }
        timer=setTimeout(function(){
            scrollTop=$(window).scrollTop();
            if(scrollTop>=250){
                el.css("top",scrollTop-180);
            }else{
                el.css("top",60)
            }
        },200);
    });
});
