var pictureUpdate=(function(config,functions){
    return{
        submitForm:function(form){
            var formObj=$(form).serializeObject();
            functions.showLoading();
            $.ajax({
                url:$(form).attr("action"),
                type:"post",
                dataType:"json",
                contentType :"application/json; charset=UTF-8",
                data:JSON.stringify(formObj),
                success:function(response){
                    if(response.success){

                        $().toastmessage("showSuccessToast",config.messages.optSuccess);
                        setTimeout(function(){
                            window.location.href=document.getElementsByTagName('base')[0].href+"admin/images/";
                        },3000);
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

    functions.createQiNiuUploader({
        maxSize:config.uploader.sizes.img,
        filter:config.uploader.filters.img,
        uploadBtn:"thumbUploadBtn",
        multipartParams:null,
        uploadContainer:"thumbUploadContainer",
        fileAddedCb:null,
        progressCb:null,
        uploadedCb:function(info,file,up){
            $("#thumb").attr("src",info.url);
            $("#drawing").val(info.url);
            //判断图片尺寸
            /*$.get(info.url+"?imageInfo",function(data){
                if(data.width==200&&data.height==200){
                    $("#thumb").attr("src",info.url);
                    $("#drawing").val(info.url);
                }else{
                    $().toastmessage("showErrorToast",config.messages.imageNot200X200);
                }

            });*/
        }
    });

    $("#myForm").validate({
        ignore:[],
        rules:{
            name:{
                required:true,
                maxlength:32
            },
            url:{
                required:true
            }
        },
        messages:{
            name:{
                required:config.validErrors.required,
                maxlength:config.validErrors.maxLength.replace("${max}",32)
            },
            url:{
                required:config.validErrors.required
            }
        },
        submitHandler:function(form) {
            pictureUpdate.submitForm(form);
        }
    });
});
