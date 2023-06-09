import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9091/api',
  timeout: 10000
});

export const get = (url, param = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    instance.get(url, { params: param, headers: headers }, {
    }).then((response) => {
      resolve(response.data);
    }, err => {
      console.log('error in post', err);
      reject(err);
    })
  });
}

export const post = (url, data = {}, param = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (localStorage.jwtToken) {
    headers['Authorization'] = `${localStorage.jwtToken}`
  }
  return new Promise((resolve, reject) => {
    instance.post(url, data, { params: param, headers: headers }).then((response) => {
      resolve(response.data);
    }, err => {
      console.log('error in post', err);
      reject(err);
    })
  });
}

export const put = (url, data = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (localStorage.jwtToken) {
    headers['Authorization'] = `${localStorage.jwtToken}`
  }
  return new Promise((resolve, reject) => {
    instance.put(url, data, {
      headers: headers
    }).then((response) => {
      resolve(response.data);
    }, err => {
      console.log('error in post', err);
      reject(err);
    })
  });
}

export const deleteAPI = (url) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (localStorage.jwtToken) {
    headers['Authorization'] = `${localStorage.jwtToken}`
  }
  console.log(headers);
  return new Promise((resolve, reject) => {
    instance.delete(url, {
      headers: headers
    }).then((response) => {
      resolve(response.data);
    }, err => {
      console.log('error in deleteAPI', err);
      reject(err);
    })
  });
}

export const postForm = (url, file) => {
  const headers = {};
  if (localStorage.jwtToken) {
    headers['Authorization'] = `${localStorage.jwtToken}`
  }
  return new Promise((resolve, reject) => {
    instance.postForm(url, {
      'file': file
    }, {
      headers: headers
    }).then((response) => {
      resolve(response.data);
    }, err => {
      console.log('error in postForm', err);
      reject(err);
    })
  });
}
