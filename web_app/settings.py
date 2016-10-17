# coding:utf-8

import os

basedir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))

timezone_name = u'Asia/Shanghai'

qiniu_bucket = "dongjinku"
qiniu_baseurl = "http://7xkrns.com1.z0.glb.clouddn.com/"
qiniu_ak = "Q-DeiayZfPqA0WDSOGSf-ekk345VrzuZa_6oBrX_"
qiniu_sk = "fIiGiRr3pFmHOmBDR2Md1hTCqpMMBcE_gvZYMzwD"

USER_APP_NAME = u'侗锦库'
USER_ENABLE_EMAIL = True
USER_ENABLE_USERNAME = False
USER_ENABLE_RETYPE_PASSWORD = True
USER_ENABLE_CHANGE_USERNAME = False
USER_ENABLE_CONFIRM_EMAIL = False
USER_ENABLE_LOGIN_WITHOUT_CONFIRM_EMAIL = True
USER_SEND_PASSWORD_CHANGED_EMAIL = False
USER_AUTO_LOGIN_AFTER_RESET_PASSWORD = False
USER_LOGIN_URL = '/login'
USER_LOGOUT_URL = '/logout'
USER_REGISTER_URL = '/register'
USER_FORGOT_PASSWORD_URL = '/forgot-password'
WTF_CSRF_ENABLED = False

cache_key_prefix = 'djk:'
