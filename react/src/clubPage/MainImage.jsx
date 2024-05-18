import React from 'react';
import { Image } from 'antd';

function MainImage ({ image }) {
    return (
        <Image
        width={50}
        style = {{borderRadius: '50%'}}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
    );
}

export default MainImage;
