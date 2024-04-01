import React, { createContext, useContext, useState } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState("");

    const initializeWeb3 = async () => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                setWeb3(web3Instance);
            } catch (error) {
                console.error('User denied account access');
            }
        } else {
            console.error('MetaMask not found');
        }
        window.ethereum.on('accountsChanged', (accounts) => {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            setAccount(accounts[0]);
            console.log("Se ha cambiado de cuenta" + accounts[0])
          });
    };

    return (
        <Web3Context.Provider value={{ web3, initializeWeb3, account }}>
            {children}
        </Web3Context.Provider>
    );
};
