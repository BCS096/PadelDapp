import './App.css'
import Banner0 from './mainPage/Banner0';
import Content0 from './mainPage/Content0';
import Content1 from './mainPage/Content1';
import Content2 from './mainPage/Content2';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { useWeb3 } from './Web3Provider';
import { PadelDBService } from './services/PadelDBService';
import JugadorForm from './mainPage/JugadorForm';
import ClubForm from './mainPage/ClubForm';
import MetaMaskLogo from './mainPage/metamask.webp';
import { useNavigate } from 'react-router-dom';


function App() {

  const [infoModal, setInfoModal] = useState(false);
  const { initializeWeb3, web3, account } = useWeb3();
  const [isNuevoUsuario, setIsNuevoUsuario] = useState(null);
  const [redirect, setRedirect] = useState(false); 
  const [newJugador, setNewJugador] = useState(null);
  const padelDBService = new PadelDBService();

  const navigate = useNavigate();

  const openInfoModal = () => {
    setInfoModal(true);
  };

  const closeInfoModal = () => {
    setInfoModal(false);
  };

  const closeUserModal = () => {
    setIsNuevoUsuario(false);
  };

  const closeJugadorModal = () => {
    setNewJugador(null);
  }

  const nuevoJugador = () => {
    setNewJugador(true);
  };

  const nuevoClub = () => {
    setNewJugador(false);
  };


  useEffect(() => {
    if (infoModal && web3) {
      closeInfoModal();
      closeUserModal();
      closeJugadorModal();
      padelDBService.isNuevoUsuario(account).then(resultado => {
        console.log('resultado', resultado);
        setIsNuevoUsuario(resultado);
        setRedirect(!resultado);
      });
    }
  }, [infoModal, web3, account]);

  useEffect(() => {
    // Si isNuevoUsuario cambia y no es nulo, realiza la lógica correspondiente
    if (redirect) {
      padelDBService.isJugador(account).then(resultado => {
        if (resultado) {
          navigate('/jugador');
        } else {
          navigate('/club');
        }
      });
      //navigate('/club');
    }
  }, [redirect]);


  return (
    <>
      <Banner0
        id="Banner0_1"
        key="Banner0_1"
        openInfoModal={openInfoModal}
      />
      <Content2
        id="Content2_0"
        key="Content2_0"
      />
      <Content0
        id="Content0_0"
        key="Content0_0"
      />
      <Content1
        id="Content1_0"
        key="Content1_0"
      />
      {
        infoModal && (
          <Modal visible={true} onCancel={closeInfoModal} onOk={closeInfoModal}>
            <div style={{ textAlign: 'center' }}>
              <img src={MetaMaskLogo} alt="MetaMask Logo" style={{ width: '100px', height: '100px', marginBottom: '20px' }} />
              <p>
                Active su cuenta MetaMask a través de la extensión. Si no tiene MetaMask en el navegador, puede instalarlo haciendo clic <a href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=es&utm_source=ext_sidebar" target="_blank" rel="noopener noreferrer">aquí</a>.
              </p>
            </div>
          </Modal>
        )
      }
      {
        isNuevoUsuario && web3 && (
          <Modal visible={true} footer={null} maskClosable={true} onCancel={closeUserModal}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Escoge tu rol !</h1>
              <Button type="primary" size="large" style={{ marginBottom: '10px' }} onClick={nuevoJugador} >JUGADOR</Button>
              <br />
              <Button size="large" onClick={nuevoClub}>CLUB</Button>
            </div>
          </Modal>
        )
      }
      {
        newJugador && web3 && (
          <Modal visible={true} footer={null} maskClosable={true} onCancel={closeJugadorModal}>
            <div>
              <JugadorForm />
            </div>
          </Modal>
        )
      }
      {
        newJugador == false && web3 && (
          <Modal visible={true} footer={null} maskClosable={true} onCancel={closeJugadorModal}>
            <ClubForm />
          </Modal>
        )
      }
    </>
  )
}

export default App
