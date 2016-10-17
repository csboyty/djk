var patternUpdate=(function(config,functions){

    var uploadedMedias={};
    var fileIdToMediaId={};
    /**
     * 显示步骤对应的面板
     * @param {Number} stepId 需要显示的面板的id
     */
    function showStepPanel(stepId){
        $(".zyupStepPanel").addClass("zyupHidden");
        $(stepId).removeClass("zyupHidden");
        $(".zyupStepCurrent").removeClass("zyupStepCurrent");
        $(".zyupStep[href='"+stepId+"']").addClass("zyupStepCurrent");
    }
    /**
     * 产生随机数，可以自带前缀arguments[0]============
     * @returns {string} 返回产生的字符串
     */
    function getRandom(){
        var date = new Date();
        var mo = (date.getMonth() + 1) < 10 ? ('0' + '' + (date.getMonth() + 1)) : date.getMonth() + 1;
        var dd = date.getDate() < 10 ? ('0' + '' + date.getDate()) : date.getDate();
        var hh = date.getHours() < 10 ? ('0' + '' + date.getHours()) : date.getHours();
        var mi = date.getMinutes() < 10 ? ('0' + '' + date.getMinutes()) : date.getMinutes();
        var ss = date.getSeconds() < 10 ? ('0' + '' + date.getSeconds()) : date.getSeconds();
        var retValue = date.getFullYear() + '' + mo + '' + dd + '' + hh + '' + mi + '' + ss + '';
        for (var j = 0; j < 4; j++) {
            retValue += '' + parseInt(10 * Math.random()) + '';
        }
        if (arguments.length == 1) {
            return arguments[0] + '' + retValue;
        }else{
            return retValue;
        }
    }

    /**
     * 拖拽函数====================
     */
    function drag(){
        var targetOl = document.getElementById("zyupMediaList");//容器元素
        var eleDrag = null;//被拖动的元素

        targetOl.onselectstart=function(event){
            if(event.target.className.match("zyupMediaItem")!==null){

                event.preventDefault();
                event.stopPropagation();
            }
        };
        targetOl.ondragstart=function(event){
            if(event.target.className.match("zyupMediaItem")!==null){
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text","移动中");
                eleDrag = event.target||event.srcElement;

                return true;
            }
        };
        targetOl.ondragend=function(event){
            if(event.target.className.match("zyupMediaItem")!==null){
                eleDrag=null;

                event.preventDefault();
                event.stopPropagation();
            }
        };

        //在元素中滑过
        targetOl.ondragover = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };

        targetOl.ondrop=function(event){

            event.preventDefault();
            event.stopPropagation();
        };

        //ol作为最大的容器也要处理拖拽事件，当在li上滑动的时候放到li的前面，当在ol上滑动的时候放到ol的最后面
        targetOl.ondragenter = function (event) {
            var target=event.toElement||event.target;
            var targetParent=target.parentNode;
            if (target == targetOl) {
                targetOl.appendChild(eleDrag);
            }else{
                if(target.tagName=="LI"){
                    targetOl.insertBefore(eleDrag, target);
                }else{
                    targetOl.insertBefore(eleDrag, targetParent);
                }
            }

            event.preventDefault();
            event.stopPropagation();
        };
    }
    /**
     * 将已经上传的媒体文件记录到uploadedMedias对象中(hash表)=================
     * @param {String} filename 媒体文件名称
     * @param {String} url 媒体文件地址
     * @param {String} mediaId 媒体文件media对象id
     */
    function initUploadedMediasObj(filename,url,mediaId){
        uploadedMedias[mediaId] = {

            //声明一个空的对象，后续将内容全部加入
        };

        uploadedMedias[mediaId][config.mediaObj.mediaThumbFilename] = filename;
        uploadedMedias[mediaId][config.mediaObj.mediaThumbFilePath] = url;
        uploadedMedias[mediaId][config.mediaObj.mediaFilename] = "";
        uploadedMedias[mediaId][config.mediaObj.mediaFilePath] = "";
        uploadedMedias[mediaId][config.mediaObj.mediaType] = config.mediaTypes.image;
        uploadedMedias[mediaId][config.mediaObj.mediaTitle] = "";
        uploadedMedias[mediaId][config.mediaObj.mediaMemo] = "";
    }

    return {
        drag:drag,
        fileIdToMediaId:fileIdToMediaId,
        fileUploadHandler:null,
        fileWhichUpload:null,
        createThumbUploader:function(){
            functions.createQiNiuUploader({
                maxSize:config.uploader.sizes.img,
                filter:config.uploader.filters.img,
                uploadBtn:"zyupThumbUploadBtn",
                uploadContainer:"zyupThumbContainer",
                uploadedCb:function(info,file,up){
                    //判断是否是1：1
                    $.get(info.url+"?imageInfo",function(data){
                        //console.log(data);
                        if(data.width==300&&data.height==300){
                            $("#zyupThumb").attr("src",info.url);
                            $("#zyupThumbUrl").val(info.url);
                        }else{
                            $().toastmessage("showErrorToast",config.messages.imageNot300x300);
                        }

                    });
                }
            });
        },
        createFileUploader:function(){
            var me=this;
            this.fileUploadHandler=functions.createQiNiuUploader({
                maxSize:config.uploader.sizes.all,
                filter:config.uploader.filters.zip,
                uploadBtn:"zyupFileUploadBtn",
                uploadContainer:"zyupFileContainer",
                filesAddedCb:function(files,up){
                    me.fileWhichUpload=files[0];
                    $("#zyupFilename").addClass("zyupUnUploaded");
                },
                progressCb:function(file){
                    $("#zyupFilename").text(file.name+"----"+file.percent+"%"+"--点击取消");
                },
                uploadedCb:function(info,file,up){
                    me.fileWhichUpload=null;
                    $("#zyupFilename").text(file.name).removeClass("zyupUnUploaded");
                    $("#zyupFilenameValue").val(file.name);
                    $("#zyupFileUrl").val(info.url);

                }
            });
        },
        createUploader:function(){
            var me=this;
            functions.createQiNiuUploader({
                maxSize:config.uploader.sizes.all,
                filter:config.uploader.filters.img,
                uploadBtn:"zyupUploadImage",
                multiSelection:true,
                uploadContainer:"zyupUploadImageContainer",
                filesAddedCb:function(files,up){
                    var mediaId = "";
                    var fileLength=files.length;

                    for (var i = 0; i < fileLength; i++) {


                        mediaId = getRandom("random_");
                        fileIdToMediaId[files[i]["id"]] = mediaId;

                        //组装显示的数据
                        var data = {
                            mediaId:mediaId,
                            thumbSrc:config.thumbs.smallThumb,
                            filename:"0%"
                        };

                        //显示列表项
                        var tpl = $("#zyupMediaItemTpl").html();
                        var html = juicer(tpl, data);
                        $("#zyupMediaList").append(html);
                    }

                },
                progressCb:function(file){
                    $(".zyupMediaItem[data-media-id='" + fileIdToMediaId[file.id] + "']").
                        find(".zyupMediaFilename").html(file.percent + "%");
                },
                uploadedCb:function(response,file,up){
                    $(".zyupMediaItem[data-media-id='" + fileIdToMediaId[file.id] + "']").
                        find(".zyupMediaFilename").html(file.name).end().
                        find(".zyupDelete").removeClass("zyupHidden").end().find(".zyupSmallThumb").
                        attr("src",response.url);

                    initUploadedMediasObj(file.name,response.url,fileIdToMediaId[file.id]);
                }
            });
        },
        createMediaThumbUploader:function(){
            functions.createQiNiuUploader({
                maxSize:config.uploader.sizes.all,
                filter:config.uploader.filters.img,
                uploadBtn:"zyupMediaThumbUploadButton",
                multiSelection:false,
                uploadContainer:"zyupMediaThumbUploadContainer",
                uploadedCb:function(response,file,up){
                    uploadedMedias[currentMediaId][config.mediaObj.mediaThumbFilename]=file.name;
                    uploadedMedias[currentMediaId][config.mediaObj.mediaThumbFilePath]=response.url;
                    $(".zyupMediaItem[data-media-id='" + currentMediaId + "']").
                        find(".zyupMediaFilename").html(file.name).end().find(".zyupSmallThumb").
                        attr("src",response.url);
                    $("#zyupMediaThumb").attr("src",response.url);
                }
            });
        },

        deleteFile:function(el){
            var parentLi=$(el).parent("li"),
                mediaId=parentLi.data("media-id");
            parentLi.remove();
            uploadedMedias[mediaId]=undefined;
            delete uploadedMedias[mediaId];
        },
        /**
         * 已经上传的文件列表项点击事件处理==========================================
         * @param {Object} target 点击的项目中的a.zyupMediaItem
         */
        uploadedLiClickHandler:function(target){
            var active=$(".zyupMediaItemActive"),
                currentMediaObj;
            if(active.length!=0){
                active.removeClass("zyupMediaItemActive");
            }

            currentMediaId=target.data("media-id");
            currentMediaObj=uploadedMedias[currentMediaId];

            //设置数据
            $("#zyupMediaThumb").attr("src",currentMediaObj[config.mediaObj.mediaThumbFilePath]);
            $("#zyupMediaTitle").val(currentMediaObj[config.mediaObj.mediaTitle]);
            $("#zyupMediaMemo").val(currentMediaObj[config.mediaObj.mediaMemo]);

            if(currentMediaObj[config.mediaObj.mediaFilename]){
                $("#zyupBindFileName").text(currentMediaObj[config.mediaObj.mediaFilename]);
                $("#zyupBindFileInfo").removeClass("zyupHidden");
            }else{
                $("#zyupBindFileInfo").addClass("zyupHidden");
            }


            //控制类
            target.addClass("zyupMediaItemActive");

            $("#zyupContent").removeClass("zyupHidden");

        },
        /**
         * ============================
         * @param value
         */
        setMediaTitle:function(value){
            uploadedMedias[currentMediaId][config.mediaObj.mediaTitle]=value;
        },

        /**
         * ================================
         * @param value
         */
        setMediaMemo:function(value){
            uploadedMedias[currentMediaId][config.mediaObj.mediaMemo]=value;
        },
        stepHandler:function(stepId){
            if(stepId!="#zyupStep1"){
                if($("#zyupTitleInput").val()==""||$("#zyupDescriptionTxt").val()==""||
                    $("#zyupThumbUrl").val()==""||$("#zyupFileUrl").val()==""){
                    $().toastmessage("showErrorToast",config.messages.stepOneUnComplete);
                    return false;
                }
            }

            if(stepId=="#zyupStep3"){

                //判断第二中的内容是否都已经填写完整。
                if($(".zyupMediaItem").length==0||$(".zyupUnCompleteLi").length!=0){
                    $().toastmessage("showErrorToast",config.messages.stepTwoUnComplete);
                    return false;
                }


                //显示
                //this.preview();
            }

            showStepPanel(stepId);

        },
        formSubmit:function(form){
            functions.showLoading();
            var assets=[],references=[];
            var formObj=$(form).serializeObject();
            for(var obj in uploadedMedias){
                assets.push(uploadedMedias[obj]);
            }
            $("#zyupReferences .rItem").each(function(index,el){
                references.push({
                    name:$(el).find(".name").val(),
                    intro:$(el).find(".intro").val()
                })
            });
            formObj.assets=assets;
            formObj.references=references;
            formObj.attachment={
                name:$("#zyupFilenameValue").val(),
                url:$("#zyupFileUrl").val()
            };

            $.ajax({
                url:$(form).attr("action"),
                type:"post",
                dataType:"json",
                contentType :"application/json; charset=UTF-8",
                data:JSON.stringify(formObj),
                success:function(response){
                    if(response.success){
                        $().toastmessage("showSuccessToast",config.messages.optSuccess);
                        functions.timeoutRedirect("admin/patterns/");
                    }else{
                        functions.ajaxReturnErrorHandler(response.error_code);
                    }
                },
                error:function(){
                    functions.ajaxErrorHandler();
                }
            });
        },
        getPost:function(id){
            var me=this;
            $.ajax({
                url:config.ajaxUrls.patternGetDetail.replace(":id",id),
                dataType:"json",
                type:"get",
                success:function(response){
                    if(response.success){
                        var length=response.pattern.assets.length;
                        for(var i=0;i<length;i++){
                            uploadedMedias[i+1]=response.pattern.assets[i];
                        }
                    }else{
                        functions.ajaxReturnErrorHandler(response.error_code);
                    }
                },
                error:function(){
                    functions.ajaxErrorHandler();
                }
            });
        }
    }
})(config,functions);

$(document).ready(function(){
    if(patternId){
        patternUpdate.getPost(patternId);
    }

    patternUpdate.drag();

    $("#zyupAddReference").click(function(){
        var tpl=$("#zyupReferenceTpl").html();
        var html=juicer(tpl,{});
        $(html).insertBefore($(this));
    });

    $("#zyupFilename").click(function(){
        if($(this).hasClass("zyupUnUploaded")!=-1&&patternUpdate.fileWhichUpload){
            patternUpdate.fileUploadHandler.removeFile(patternUpdate.fileWhichUpload);
            patternUpdate.fileUploadHandler.stop();
            $(this).text("");
        }

    });

    //步骤控制
    $("#zyupTab a").click(function(){
        patternUpdate.stepHandler($(this).attr("href"));

        return false;
    });

    $("#zyupMediaList").on("click",".zyupDelete",function(){
        patternUpdate.deleteFile($(this));
    });

    //列表中每一项的点击事件，如果选中的列表没有填写完整，则不能选择其他列表
    $(document).on("click",".zyupMediaItem",function(){
        patternUpdate.uploadedLiClickHandler($(this));

        return false;
    });
    $("#zyupMediaTitle").blur(function(){
        patternUpdate.setMediaTitle($(this).val());
    });
    $("#zyupMediaMemo").blur(function(){
        patternUpdate.setMediaMemo($(this).val());
    });


    patternUpdate.createUploader();
    patternUpdate.createFileUploader();
    patternUpdate.createThumbUploader();
    patternUpdate.createMediaThumbUploader();

    $("#zyupForm").submit(function(){
        patternUpdate.formSubmit($(this));
        return false;
    }).on("keydown",function(event){
            if(event.keyCode==13){
                return false;
            }
        })
});