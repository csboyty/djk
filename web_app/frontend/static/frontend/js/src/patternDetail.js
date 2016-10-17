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

    $("#postList").on("click",".title",function(){
        var postListEl=$("#postList");
        if($(this).hasClass("opened")){
            $(this).removeClass("opened").addClass("closed");
            $(this).parent().find(".content").addClass("hidden");
        }else{
            postListEl.find(".content").addClass("hidden");
            postListEl.find(".opened").removeClass("opened").addClass("closed");
            $(this).removeClass("closed").addClass("opened");
            $(this).parent().find(".content").removeClass("hidden");
        }
    });


});