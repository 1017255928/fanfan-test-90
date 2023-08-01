import React from 'react';
import ReactDOM from 'react-dom';
import './alert.css'  // 假设你有一个单独的CSS文件定义样式

const Alert = ({ message, closeAlert }) => (
  <div className='alert-overlay'>
    <div className='alert-box'>
      <p>{message}</p>
      <button onClick={closeAlert}>close</button>
    </div>
  </div>
);

const alert = (message) => {
  const alertElement = document.createElement('div');
  alertElement.style.position = 'relative';
  alertElement.style.zIndex = '1000000';
  document.body.appendChild(alertElement);

  const closeAlert = () => {
    ReactDOM.unmountComponentAtNode(alertElement);
    document.body.removeChild(alertElement);
  }

  ReactDOM.render(<Alert message={message} closeAlert={closeAlert} />, alertElement);
}

export default alert