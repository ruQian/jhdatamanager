import request from '../utils/request';
const ApiRootUrl = 'http://127.0.0.1:7001/api/v1/';

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
