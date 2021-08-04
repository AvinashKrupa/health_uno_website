import axios from 'axios';
import {getData, storeData} from '../../storage/LocalStorage/LocalAsyncStorage';
import Constants from '../../constants/index.js';
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: Constants.BASE_URL,
});

// Add a request interceptor

instance.interceptors.request.use(
  async config => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjBmZmUxMzI0NGU5YzUwMDIxNTMwYjJjIiwibW9iaWxlX251bWJlciI6IjczMDAzNDA0MDkiLCJmaXJzdF9uYW1lIjoiWWF0aXNoIiwic2VsZWN0ZWRfcHJvZmlsZSI6IjEiLCJpYXQiOjE2MjczODIwNjYsImV4cCI6MTYyNzM4NTY2Nn0.m5KrEqpC85hGAa6S82DZ6k9HiIEojsbouvmrQKnKYaQ'; //await getData('ACCESS_TOKEN');
    const temp = await getData('TEMP_TOKEN');
    console.log('CONSOL', config);
    if (temp) {
      config.headers['Authorization'] = 'Bearer ' + temp;
    }
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }

    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

//Add a response interceptor

instance.interceptors.response.use(
  response => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url === 'Constants.BASE_URL'
    ) {
      //  router.push('/login');
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const headers = {
        'Content-Type': 'application/json',
      };
      return axios
        .post(
          'Constants.BASE_URL',
          // qs.stringify({
          //   grant_type: 'client_credentials',
          //   client_secret: '2f9nZDVB74IJy3EGNlKwfjByilmX2fvJCkqa1uvtb2',
          //   client_id: 'icdfxpvEPrXVTJghsfkDTfWYaQpXdvNoyRj8vXrpOp',
          // }),
          '',
          {headers: headers},
        )
        .then(res => {
          if (res.status === 200) {
            storeData('ACCESS_TOKEN', res.data.access_token);
            axios.defaults.headers.common['Authorization'] =
              'Bearer ' + res.data.access_token;
            return axios(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  },
);
export default instance;
