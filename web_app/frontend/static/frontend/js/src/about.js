$(document).ready(function(){


    if(pageName){
        $("#menu a[data-page-name='"+pageName+"']").addClass("active");
    }

    $("#directory").on("click","a",function(){
        var target=$(this).attr("href");
        var top=$(target).offset().top;
        $("#directory a.active").removeClass("active");
        $("html,body").scrollTop(top);
        $(this).addClass("active");

        return false;
    });



    var timer=null;
    var el=$(".info");
    var scrollTop=0;
    $(window).scroll(function(){
        if(timer){
            clearTimeout(timer);
            timer=null;
        }
        timer=setTimeout(function(){
            scrollTop=$(window).scrollTop();

            if(scrollTop>=500){
                el.css("marginTop",scrollTop-400)
            }else{
                el.css("marginTop",20)
            }

            for(var i=1,len=8;i<len;i++){
                if(scrollTop<$("#section"+i).offset().top+20){
                    $("#directory a.active").removeClass("active");
                    $("a[href='#section"+i+"']").addClass("active");
                    break;
                }
            }
        },100);
    });
});