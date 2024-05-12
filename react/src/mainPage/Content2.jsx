import React from 'react';
import './Content0.css';
import {Row} from 'antd';
import './Content1.css';
import ContainerInfo from '../components/ContainerInfo';

function Content2(props) {      
    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }} className='rounded-box'>
            <ContainerInfo/> 
        </div>
      </div>
    );
}

export default Content2;
