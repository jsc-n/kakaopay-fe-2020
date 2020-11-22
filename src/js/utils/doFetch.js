import axios, { CancelToken } from 'axios';
import qs from 'qs';
import { API, ERROR_MSG } from '../assets/constants';

const AXIOS_DEFAULT_OPTION = {
  baseURL: API.BASE_URL,
  timeout: API.TIMEOUT,
  withCredentials: true
};

const instance = axios.create(AXIOS_DEFAULT_OPTION);

instance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.log(error.response.message);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.message.includes('timeout')) {
      return Promise.reject(new Error(ERROR_MSG.REQUEST_TIME_OUT));
    } else {
      return Promise.reject(error);
    }
  }
);

const doFetch = {
  get: (api, option = {}, cancel = null) => {
    let newOption = option;
    // reference: https://github.com/axios/axios#request-config
    if (Object.prototype.hasOwnProperty.call(newOption, 'params')) {
      Object.values(newOption.params).forEach(value => {
        if (Array.isArray(value)) {
          newOption = Object.assign({}, newOption, {
            paramsSerializer: params => {
              return qs.stringify(params, {
                arrayFormat: 'repeat'
              });
            }
          });
        }
      });
    }

    if (cancel) {
      const cancelToken = new CancelToken(cancel);
      newOption = Object.assign({}, newOption, {
        cancelToken
      });
    }

    return instance.get(api, newOption);
  }
};

export default doFetch;
