var tyPhoto=(function(config,functions){
    return {
        offset:10,
        isAnimating:false,
        loadPhotos:function(){
            var me=this;
            $.ajax({
                url:config.ajaxUrls.imagesGetAll,
                type:"get",
                data:{
                    offset:me.offset,
                    limit:config.perLoadCounts.list
                },
                success:function(response){
                    if(response.success){

                        var tpl=$("#tyPhotoTpl").html();
                        var html=juicer(tpl,response);
                        $("#tyPhotos .list").append(html);

                        if(response.results.length==config.perLoadCounts.list){
                            me.offset+=config.perLoadCounts.list;
                        }else{
                            me.offset=-1;
                            $(".nav1").addClass("hidden");
                        }
                    }else{
                        functions.ajaxReturnErrorHandler(response.error_code);
                    }
                },
                error:function(response){
                    functions.ajaxErrorHandler();
                }
            })
        },
        init:function(){
            if($("#tyPhotos .list li").length!=10){
                this.offset=-1;
            }
        },
        navHandler:function(el){
            var direction=el.data("direction");
            var list=$("#tyPhotos .list");
            var listHeight=list.height();
            var photoViewHeight=$("#tyPhotos").height();
            var marginTop=parseInt(list.css("marginTop"));
            var me=this;
            me.isAnimating=true;
            switch(direction){
                case "up":
                    $(".nav2").removeClass("hidden");
                    marginTop-=photoViewHeight;
                    list.animate({
                        "marginTop":marginTop+"px"
                    },200,function(){
                        if(Math.abs(marginTop)>=listHeight-photoViewHeight*2&&me.offset!=-1){
                            me.loadPhotos();
                        }
                        if(Math.abs(marginTop)+photoViewHeight>=listHeight){
                            $(".nav1").addClass("hidden");
                        }
                        me.animating=false;
                    });
                    break;
                case "down":
                    $(".nav1").removeClass("hidden");
                    marginTop+=photoViewHeight;
                    list.animate({
                        "marginTop":marginTop+"px"
                    },200,function(){
                        if(Math.abs(marginTop)==0){
                            $(".nav2").addClass("hidden");
                        }
                        me.animating=false;
                    });
                    break;
            }

        }
    }
})(config,functions);
$(document).ready(function(){
    tyPhoto.init();

    $("#tyPhotos .list").on("click","img",function(){
        $("#tyPhotoDetail img").attr("src",$(this).attr("src"));
        $("#tyPhotoDetail .name").text($(this).data("name")+":"+$(this).data("intro"));
        $("#currentPage").text($(this).parent().index()+1);
    });

    $(".nav").click(function(){
        if(!tyPhoto.isAnimating){
            tyPhoto.navHandler($(this));
        }
    });
});
