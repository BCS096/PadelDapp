import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState("");

    useEffect(() => {
        const savedAccount = localStorage.getItem('account');
        if (savedAccount) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            setAccount(savedAccount);
            console.log("Me renderizo :)");
        }
    }, []);

    const initializeWeb3 = async () => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                setWeb3(web3Instance);
                localStorage.setItem('account', accounts[0]);
            } catch (error) {
                console.error('User denied account access');
            }
        } else {
            console.error('MetaMask not found');
        }
        window.ethereum.on('accountsChanged', (accounts) => {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            if (accounts[0]) {
                setAccount(accounts[0]);
                localStorage.setItem('account', accounts[0]);
                console.log("Account changed to: " + accounts[0]);
            } else {
                console.log("No account available");
                setWeb3(null);
                setAccount("");
                localStorage.removeItem('account');
            }
        });
    };

    return (
        <Web3Context.Provider value={{ web3, initializeWeb3, account, setAccount, setWeb3 }}>
            {children}
        </Web3Context.Provider>
    );
};
