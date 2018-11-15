var now = Date.now();
var appId = 'A6087487695567';
var appKey = 'A6087487695567';

function obj2url(obj) {
    let url = '?';
    for (const k in obj) {
        if (obj[k] !== '' && obj[k] !== null && obj[k] !== undefined) {
            url += `${k}=${obj[k]}&`;
        }
    }
    return url;
}

function fnGet(path, filter, isProgress, callback) {
    if (isProgress) {
        api.showProgress({
            title: '努力加载中...',
            text: '先喝杯茶...',
            modal: false
        });
    }
    const userToken = $api.getStorage('userInfo').id;
    const nowTime = (new Date()).getTime().toString().substring(0, (new Date()).getTime().toString().length - 3);
    const userSign = md5('QM<g^mqw0`dH/Wuc{T&dJu+b&A|lEV!*SXTo' + userToken + nowTime);
    filter.userToken = userToken;
    filter.userSign = userSign;
    param = obj2url(filter);
    api.ajax({
        url: path + param,
        method: 'get',
        timeout: 5,
        dataType: 'json',
        headers: {
            "X-APICloud-AppId": appId,
            "X-APICloud-AppKey": appKey
        }
    }, function(ret, err) {
        if (isProgress) {
            api.hideProgress();
        }
        if (!ret.success) {
            api.toast({
                msg: ret.message || ret.msg || '出租啦，稍后再试',
                duration: 2000,
                location: 'bottom'
            });
        }
        callback(ret, err);
    });
};

function fnPost(path, data, isProgress, callback, isLogin, isPut) {
    var headers = {
        "X-APICloud-AppId": appId,
        "X-APICloud-AppKey": appKey
    };

    if (!isLogin) {
        const userInfo = $api.getStorage('userInfo');
        if (userInfo) {
            const userToken = userInfo.id;
            const nowTime = (new Date()).getTime().toString().substring(0, (new Date()).getTime().toString().length - 3);
            const userSign = md5('QM<g^mqw0`dH/Wuc{T&dJu+b&A|lEV!*SXTo' + userToken + nowTime);
            data.values.userToken = userToken;
            data.values.userSign = userSign;
        } else {
            api.toast({
                msg: '请先登录，即将跳转到登录页面',
                duration: 2000,
                location: 'bottom'
            });
            setTimeout(() => {
                api.openWin({
                    name: 'login',
                    url: 'widget://html/login.html',
                });
            }, 2000);

        }
    }
    if (isProgress) {
        api.showProgress({
            title: '努力加载中...',
            text: '先喝杯茶...',
            modal: false
        });
    }
    api.ajax({
        url: path,
        method: isPut ? 'put' : 'post',
        timeout: 10,
        dataType: 'json',
        returnAll: false,
        headers: headers,
        data: data
    }, function(ret, err) {
        if (!ret.success) {
            api.toast({
                msg: ret.message || ret.msg || '出租啦，稍后再试',
                duration: 2000,
                location: 'bottom'
            });
        }
        if (isProgress) {
            api.hideProgress();
        }
        callback(ret, err);
    });
};
