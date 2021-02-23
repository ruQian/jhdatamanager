import request from '../utils/request';
const ApiRootUrl = 'http://www.ylhzzy.top:8828/api/v1/';

export const fetchData = () => {
    console.log(ApiRootUrl+'featuredata');
    return request({
        url:  ApiRootUrl+'featuredata',
        method: 'get'
    });
};


//上传一个数据点
export const uploadFeatureApi = params => {
    //header
    return request({
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
        url: ApiRootUrl+'featuredata/uid',
        method: 'get',
        params: params["data"]
    });
};
