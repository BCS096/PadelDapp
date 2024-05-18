import React from 'react';
import { Image } from 'antd';

function MainImage ({ image }) {
    return (
        <Image
        width={50}
        height={50}
        style = {{borderRadius: '50%'}}
        src={image}
        />
    );
}

export default MainImage;
