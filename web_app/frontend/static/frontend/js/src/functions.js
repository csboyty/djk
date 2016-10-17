/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 14-10-13
 * Time: 上午9:26
 * To change this template use File | Settings | File Templates.
 */
var functions=(function(config){

    //浏览器前缀
    var prefixes=["Moz",'webkit','ms','O'];

    return {

        /**
         * 3秒跳转
         * @param url 需要跳转到的url
         */
        timeoutRedirect:function(url){
            setTimeout(function(){
                window.location.href=url;
            },3000);
        },

        /**
         * 获取文件的信息
         * @param fileName
         * @returns {{filePath: string, filename:string, ext: string}}
         */
        getFileInfo:function(fileName){
            var extPos=fileName.lastIndexOf(".");
            var pathPost=fileName.lastIndexOf("/");
            return {
                filePath:pathPost!=-1?fileName.substring(0,pathPost+1):"",
                filename:fileName.substring(pathPost+1,extPos),
                ext:fileName.substring(extPos+1)
            }
        },
        	
        getSuffixFile:function(file,suffix){
            var pathInfo=this.getFileInfo(file);
            return pathInfo.filePath+pathInfo.filename+suffix+"."+pathInfo.ext;
        },
        /**
         * 显示loading遮盖层
         */
        showLoading:function(){
            $("#loading").removeClass("hidden");
        },
        /**
         * 隐藏loading遮盖层
         */
        hideLoading:function(){
            $("#loading").addClass("hidden");
        },
        /**
         * ajax网络错误处理
         */
        ajaxErrorHandler:function(){
            this.hideLoading();
            $().toastmessage("showErrorToast",config.messages.networkError);
        },
        /**
         * ajax后台返回错误处理
         * @param errorCode {string} 错误代码
         */
        ajaxReturnErrorHandler:function(errorCode){
            var me=this;
            var message="";
            switch(errorCode){
                case "10001":
                    message=config.messages.sportsNoExist;
                    this.timeoutRedirect("./",true);
                    break;
                case "10002":
                    message=config.messages.sportsNameExist;
                    me.timeoutRedirect("./");
                    break;
                case "20001":
                    message=config.messages.userNotInSports;
                    break;
                case "20002":
                    message=config.messages.userIsInSports;
                    break;
                case "30001":
                    message=config.messages.teamNotExist;
                    break;
                case "30002":
                    message=config.messages.teamExist;
                    break;
                case "40001":
                    message=config.messages.teamMemberNotIn;
                    break;
                case "40002":
                    message=config.messages.teamMemberIn;
                    break;
                case "40003":
                    message=config.messages.teamMemberOut;
                    break;
                case "50001":
                    message=config.messages.competitionNotExist;
                    break;
                case "50002":
                    message=config.messages.playerCanNotJoinIn;
                    break;
                case "50003":
                    message=config.messages.playerHasJoinIn;
                    break;
                case "50004":
                    message=config.messages.competitionHasEnded;
                    break;
                case "50005":
                    message=config.messages.competitionNotExist;
                    break;
                case "50006":
                    message=config.messages.competitionHasComplete;
                    break;
                case "50007":
                    message=config.messages.goalNotExist;
                    break;
                case "50008":
                    message=config.messages.splendidNotExist;
                    break;
                case "50009":
                    message=config.messages.competitionCanNotPromote;
                    break;
                case "50010":
                    message=config.messages.competitionHasPromoted;
                    break;
                case "50012":
                    message=config.messages.hasSetTop;
                    break;
                case "50013":
                    message=config.messages.canNotCancelTop;
                    break;
                case "50014":
                    message=config.messages.timeIsOUT;
                    break;
                case "60001":
                    message=config.messages.venueNotExist;
                    break;
                case "80003":
                    message=config.messages.pwdNotMatch;
                    break;

                default :
                    message=config.messages.systemError;
                    break;
            }
            this.hideLoading();
            $().toastmessage("showErrorToast",message);
        }

    }

})(config);

$(document).ready(function(){
    if(pageName){
        $("#menu a[data-page-name='"+pageName+"']").addClass("active");
    }
});
