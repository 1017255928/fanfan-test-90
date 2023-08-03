import Alert from "./component/Alert";
export default function xhr(url, data, callback) {
  fetch(url, {
    ...data,
    headers: {
      'Content-Type': 'application/json'
    },
  }) 
    .then(response => response.json())
    .then(data => {
      if (data.code === '502') {
        return Alert(data.message)
      }
      callback && callback(data)
    })
    .catch(error => {
      // handle error
    });
}

export const promiseXhr = (url, data) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      ...data,
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === '502') {
          reject(data.message);
        } else {
          resolve(data);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}