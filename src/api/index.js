import request from '../utils/request';
const ApiRootUrl = 'http://www.ylhzzy.top:8828/api/v1/';

export const fetchData = () => {
    console.log(ApiRootUrl+'featuredata');
    return request({
        timeout: 5000,
        url:  ApiRootUrl+'featuredata',
        method: 'get'
    });
};


//上传一个数据点
export const uploadFeatureApi = params => {
    //header
    return request({
        timeout: 5000,
        url: ApiRootUrl+'featuredata',
        method: 'post',
        data: params["data"]
    });
};

//根据UID得到一个数据点
export const getFeatureByUid = params => {
    //header
    console.log(params["data"]);
    return request({
        timeout: 5000,
        url: ApiRootUrl+'featuredata/uid',
        method: 'get',
        params: params["data"]
    });
};

//上传一个大文件
export const uploadFile = params => {
    //header
    //console.log(params["data"]);
    var headerData = new Object();
    //headerData["Content-Type"] = "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW";
    return request({
        timeout: 500000,
        url: ApiRootUrl+'upload',
        method: 'post',
        onUploadProgress:params["OnUploadProgress"],
        //headers:headerData,
        data: params["data"]
    });
};
//下载文件
export const downloadFile = params => {  
    return request({
        method: 'get',
        url: params['url'],
        onDownloadProgress:params["onDownloadProgress"]
    });
};









 




