import React, { useEffect } from 'react';
import { Collapse } from 'antd';
import { PadelDBService } from '../services/PadelDBService';
import { useState } from 'react';
import VentaTokenClub from './VentaTokenClub';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const App = () => {

    const padelDBService = new PadelDBService();
    const [clubes, setClubes] = useState([]);
    const [item, setItem] = useState([{}]);

    useEffect(() => {
        padelDBService.getClubs().then((res) => {
            setClubes(res);
            setItem(res.map((club) => {
                return {
                    key: club.id,
                    label: club.nom,
                    children: <VentaTokenClub addressClub={club.address} />,
                };
            }));
        });
    }, []);

  return <Collapse items={item} />;
};
export default App;