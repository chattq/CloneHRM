import store from 'store/store';
import { toast } from 'react-toastify';

const API_BASE_URL: string = `${process.env.REACT_APP_API_BASE_URL}`;
const AppAgent: string = `${process.env.REACT_APP_AGENT}`;
const GwUserCode: string = `${process.env.REACT_APP_GW_USER}`;
const GwUserPassword: string = `${process.env.REACT_APP_GW_USER_PW}`;
const postWithHeader = async (url: string, headers: any, params: any) => {
    try {
        if (!params) params = {};

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(params)
        };

        let fullUrl = url.indexOf('http') === 0 ? url : API_BASE_URL + '/' + url;
        const response = await fetch(fullUrl, requestOptions);
        const data = await response.json();

        return data;
    }
    catch (error: any) {
        toast.error(error.message || 'Failed');
    }
};

const post = async (url: string, params: any) => {

    const { token } = store.getState().auth;
    const { NetworkId, OrgId } = store.getState().orgInfo;

    let headers = {
        'Content-Type': 'application/json',
        "Authorization": token ? `Bearer ${token}` : '',
        "AppAgent": AppAgent,
        "GwUserCode": GwUserCode,
        "GwPassword": GwUserPassword,
        "NetworkId": NetworkId,
        "OrgId": OrgId
    };

    return postWithHeader(url, headers, params);
};

const get = async (url: string, params: any) => {

    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },

        };

        let query: string = '';

        if (params) {
            let queryString = new URLSearchParams(params).toString();

            if (url.indexOf('=') > 0)
                query = '&' + queryString;
            else
                query = '?' + queryString;

        }

        let fullUrl = url.indexOf('http') === 0 ? url : API_BASE_URL + '/' + url;

        const response = await fetch(fullUrl + query, requestOptions);
        const data = await response.json();
        return data;
    }
    catch (error: any) {
        toast.error(error.message || 'Failed');
    }
};

export { post, get, postWithHeader };