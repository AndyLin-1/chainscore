import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/context';
import NearLogo from '/public/LogoGroup.png';
import styles from './Navigation.module.css';

export const Navigation = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel('Login with a wallet');
    }
  }, [signedAccountId, wallet]);

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles['navbar-custom']}`}>
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <div className="navbar-brand">
            <Image src={NearLogo} alt="Near Logo" width={144} height={52} />
          </div>
        </div>
        <div className="ms-auto">
          <button className={`btn ${styles['custom-btn']}`} onClick={action}>{label}</button>
        </div>
      </div>
    </nav>
  );
};
