/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-10-5
 * Time: 下午5:34
 * To change this template use File | Settings | File Templates.
 */
var config={
    baseUrl:"",
    qiNiu:{
    	upTokenUrl:"qiniu-uptoken",
        uploadDomain:"http://qiniu-plupload.qiniudn.com/",
        bucketDomain:"http://7xjeh2.com1.z0.glb.clouddn.com/",
        swfUrl:"static/js/frontend/lib/Moxie.swf"
    },
    ajaxUrls:{
        databaseGetAll:"search/do",
        imagesGetAll:"images/list"
    },
    perLoadCounts:{
        table:10,
        list:10
    },
    messages:{
        successTitle:"成功提示",
        errorTitle:"错误提示",
        optSuccess:"操作成功！",
        noData:"没有数据",
        progress:"处理中...",
        notFound:"资源丢失！",
        loadDataError:"请求数据失败！",
        networkError:"网络异常，请稍后重试！",
        systemError:"系统错误，请稍后重试或者联系mail@xxx.com！",
        optSuccessRedirect:"操作成功,3秒后跳转！",
        timeout:"登录超时，3秒后自动跳到登陆页！",
        optError:"服务器端异常，请稍后重试！"
    }
};
