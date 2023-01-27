import logo from './bridge.svg';
import styles from './App.module.css';
import { isNearWalletSignedIn, signInNearWallet, signOutNearWaller, testContractCall } from './scripts/near';
import { createEffect, createSignal, onMount } from 'solid-js';
import { connectWallet, lockTokens } from './scripts/ethereum';

function App() {
  const [mmIsInstalled, setMMIsInstalled] = createSignal(false);
  const [mmIsLoggedIn, setMMIsLoggedIn] = createSignal(false);
  const [connectedMMAccount, setConnectedMMAccount] = createSignal(0);
  const [proof, setProof] = createSignal(undefined);

  onMount(async () => {
    if (!isNearWalletSignedIn()) {
      signInNearWallet();
    }
    if (typeof window.ethereum !== 'undefined') {
      setMMIsInstalled(true);
    }
  });

  createEffect(async () => {
    if (mmIsInstalled()) {
      let accounts = await connectWallet();
      setConnectedMMAccount(accounts[0]);
      if (typeof connectedMMAccount() !== 'undefined') {
        setMMIsLoggedIn(true);
      }
    }
  });

  createEffect(async () => {
    ethereum.on('accountsChanged', function(accounts) {
      let selectedAccount = accounts[0];
      setConnectedMMAccount(selectedAccount);
      console.log(`Selected account changed to ${connectedMMAccount()}`);
    });
  })

  createEffect(async () => {
    if (typeof proof() !== 'undefined') {
      console.log("proof: ", proof())
      // await testContractCall();

      setProof(undefined);
    }
  });

  const onClickSendButton = async () => {
    const topic = await lockTokens();
    setProof(topic);
    console.log("proof: ", proof());
  }

  return (
    <>
      <div class={styles.App}>
        <header class={styles.header}>
          <div>
            <img src={logo} class={styles.logo} alt="logo" />
            <h1> Night Bridge </h1>
          </div>
        </header>
        <div class={styles.content}>
          <h3>Send 100 FunCoin from Ethereum to NEAR</h3>
          <div class={styles.input}>
            <label for='address'>NEAR address</label>
            <input id={styles.address}></input>
          </div>
          {
            mmIsInstalled() ?
              mmIsLoggedIn() ?
                <button class={styles.button} onClick={() => onClickSendButton()}>Send</button> :
                <h4 class={styles.warning}>Metamask not connected</h4> :
              <h4 class={styles.warning}>Metamask not installed</h4>
          }
        </div>
        <footer class={styles.footer}>
          <a href='https://github.com/NutiNaguti'>&#9001;NutiNaguti&nbsp;</a>
          <a href=''>&#9001;Source Code</a>
        </footer>
      </div>

    </>
  );
}

export default App;
