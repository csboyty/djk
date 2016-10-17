$(document).ready(function(){
    $("#searchContainer").removeClass("hidden");

    $('#waterfallContainer').waterfall({
        colWidth:300,
        checkImagesLoaded: false,
        gutterWidth:15,
        gutterHeight:15,
        path: function(page) {
            var queryBase="?limit=" + config.perLoadCounts.list+"&offset="+(page-1)*config.perLoadCounts.list;
            var queryName="&name="+$("#searchContent").val();
            var queryTags="";
            var queryPattern="";
            var querySort="&sort="+$("#sortList .active").data("value");
            $("#selectedItems li").each(function(index,el){
                if($(el).data("type")=="tag"){
                    queryTags+="&tag="+$(el).data("value");
                }else{
                    queryPattern+="&pattern="+$(el).data("value");
                }
            });

            var query=queryBase+queryName+queryTags+queryPattern;
            return config.ajaxUrls.databaseGetAll+query;
        },
        callbacks: {
            /*
             * 处理ajax返回数方法
             * @param {String} data
             */
            renderData: function (data) {
                if(data.results.length<config.perLoadCounts.list){
                    $('#waterfallContainer').waterfall('pause', function() {
                        $('#waterfall-message').html('<p style="color:#666;">没有更多数据...</p>')
                    });
                }

                var template = $('#waterfallTpl').html();

                return juicer(template, data);
            }
        }


    });

    $("#search").click(function(){
        $('#waterfallContainer').waterfall("reload");
    });
    $("#searchContent").keydown(function(event){
        if(event.keyCode==13){
            $('#waterfallContainer').waterfall("reload");
        }
    });


    $("#selectedItems").on("click",".item",function(){
        $(this).remove();
        $("#searchItems .item[data-value='"+$(this).data("value")+"']").removeClass("active");

        $('#waterfallContainer').waterfall("reload");
    });
    $("#sortList").on("click",".item",function(){
        $("#sortList .active").removeClass("active");
        $(this).addClass("active");
        $('#waterfallContainer').waterfall("reload");
    });
    $("#searchItems").on("click",".item",function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $("#selectedItems .item[data-value='"+$(this).data("value")+"']").remove();
        }else{
            $(this).addClass("active");
            var tpl=$("#selectedItemTpl").html();
            var data={
                type:$(this).data("type")?$(this).data("type"):"tag",
                value:$(this).data("value"),
                name:$(this).data("name")
            };
            var html=juicer(tpl,data);
            $("#selectedItems").append(html);
        }

        $('#waterfallContainer').waterfall("reload");
    });
});
