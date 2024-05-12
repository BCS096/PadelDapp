import React from 'react';
import './Content0.css';
import {Row} from 'antd';
import './Content1.css';
import ContainerCards from '../components/ContainerCards';

function Content(props) {      
    return (
      <div {...props}  className='home-page-wrapper content0-wrapper'>
        <div className= 'home-page content0'>
          <div className= 'title-wrapper'>
            <h1>Clubes adheridos</h1>
          </div>
          <Row className='rounded-box'>
            <ContainerCards />
          </Row>      
        </div>
      </div>
    );
}

export default Content;
