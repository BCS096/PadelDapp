import React from 'react';
import './Content0.css';
import { Row } from 'antd';
import './Content1.css';
import ContainerInfo from '../components/ContainerInfo';

function Content2(props) {
  return (
    <div {...props} className='home-page-wrapper content0-wrapper'>
      <div className='home-page content0'>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }} className='rounded-box'>
            <ContainerInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content2;
