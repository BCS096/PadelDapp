import React from 'react';
import { Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import './Banner0.css';
import logo from './logo.png';
import { useWeb3 } from '../Web3Provider';

function Banner(props) {
  const { ...currentProps } = props;
  const {initializeWeb3, web3, account} = useWeb3();
    
    return (
      <div {...currentProps} className= 'banner0'>
        <QueueAnim
          key="QueueAnim"
          type={['bottom', 'top']}
          delay={200}
          className= 'banner0-text-wrapper'
        >
          <div key="title" className= 'banner0-title'>
              <img src={logo} width="100%" alt="img" />
          </div>
          <Button key="button" className= 'banner0-button' onClick={initializeWeb3}>
            Empieza a jugar!
          </Button>
        </QueueAnim>
        <TweenOne
          animation={{
            y: '-=20',
            yoyo: true,
            repeat: -1,
            duration: 1000,
          }}
          className="banner0-icon"
          key="icon"
        >
        </TweenOne>
      </div>
    );
  
}
export default Banner;
