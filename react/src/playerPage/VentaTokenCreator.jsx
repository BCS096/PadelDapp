import React, { useEffect, useState } from 'react';
import { InputNumber, Button, Spin } from 'antd';
import { Modal, Alert } from 'antd';
import { Divider } from 'antd';
import './VentaTokenClub.css';
import { useWeb3 } from '../Web3Provider';
import { PadelTokenService } from '../services/PadelTokenService';
import PadelTokenJSON from '../assets/contracts/PadelToken.json';

const CREATOR_ADDRESS = '0x635daF522287335E42d4789706C1A609cE578678';


const App = () => {

    const [numPDT, setNumPDT] = useState(0);
    const [padelTokenService, setPadelTokenService] = useState(null);
    const [inputValue, setInputValue] = useState(0);
    const [loadingVenta, setLoadingVenta] = useState(false);
    const { web3, account } = useWeb3();
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        description: '',
        type: ''
    });
    
    useEffect(() => {
        if (web3 && account !== '') {
            const pdtContract = new web3.eth.Contract(PadelTokenJSON.abi, PadelTokenJSON.address);
            setPadelTokenService(new PadelTokenService(pdtContract));
        }
    }
        , [web3, account]);

    useEffect(() => {
        if (padelTokenService) {
            padelTokenService.getAllowSell(CREATOR_ADDRESS).then((res) => {
                setNumPDT(res);
            });
        }
    }, [padelTokenService]);

    const handleCancel = () => {
        setModal({ visible: false });
    };

    const handlePDTVenta = async () => {
        setLoadingVenta(true);
        try {
            await padelTokenService.transfer(account, CREATOR_ADDRESS, inputValue);
            const newNumPDT = await padelTokenService.getAllowSell(CREATOR_ADDRESS);
            setNumPDT(newNumPDT);
            setModal({
                visible: true,
                message: 'Tokens comprados',
                description: 'Los tokens han sido comprados correctamente',
                type: 'success'
            });
        } catch (error) {
            setModal({
                visible: true,
                message: 'Error al comprar los tokens en venta',
                description: 'Ha ocurrido un error al comprar los tokens en venta',
                type: 'error'
            });
        }
        setLoadingVenta(false);
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <h1>Número de PDT en venta: {numPDT}</h1>
                <Divider type="vertical" className='divider-venta' />
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <InputNumber
                        min={0}
                        defaultValue={0}
                        value={inputValue}
                        onChange={setInputValue}
                        style={{ fontSize: '36px', textAlign: 'center', justifyContent: 'center', margin: '0 30px' }}
                        className="square-input-number"
                    />
                    <Button
                        type="primary"
                        onClick={handlePDTVenta}
                        disabled={loadingVenta}
                        size="large"
                        style={{ backgroundColor: 'rgb(0, 33, 64)', borderColor: '#1e90ff' }}
                    >
                        {loadingVenta ? <Spin /> : 'Comprar'}
                    </Button>
                </div>
                <Modal
                    visible={modal.visible}
                    onOk={handleCancel}
                    onCancel={handleCancel}
                    okText="Cerrar"
                    okButtonProps={{ style: { display: 'none' } }}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    style={{ position: 'absolute' }}
                    className={`ant-modal-${modal.type} ant-modal-notification`}
                >
                    <Alert
                        message={modal.message}
                        description={modal.description}
                        type={modal.type}
                        showIcon
                    />
                </Modal>
            </div>
        </>
    );
}

export default App;