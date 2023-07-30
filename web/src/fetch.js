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
        return alert(data.message)
      }
      callback && callback(data)
    })
    .catch(error => {
      // handle error
    });
}