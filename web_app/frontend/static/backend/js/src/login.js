$(document).ready(function(){
    $("#myForm").validate({
        rules: {
            email: {
                required:true,
                email:true,
                rangelength:[6, 30]
            },
            password:{
                required:true,
                rangelength:[6, 120]
            }/*,
             captcha:{
             required:true,
             rangelength:[4,4]
             }*/
        },
        messages: {
            email: {
                required:config.validErrors.required,
                email:config.validErrors.email,
                rangelength:config.validErrors.rangLength.replace("${min}",6).replace("${max}",30)
            },
            password:{
                required:config.validErrors.required,
                rangelength:config.validErrors.rangLength.replace("${min}",6).replace("${max}",20)
            }/*,
             captcha:{
             required:config.validErrors.required,
             rangelength:config.validErrors.rangLength.replace("${min}-${max}",4)
             }*/
        },
        submitHandler:function(form){

            form.submit();
        }
    });
});