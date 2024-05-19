'use client';

import styles from './landing.module.css';
import { useState, useEffect, useContext } from 'react';
import { NearContext } from '@/context';

export default function LandingPage() {
    const { signedAccountId } = useContext(NearContext);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setLoading(false);
    }, [signedAccountId]);

    useEffect(() => {
        if (!loading) {
          if(signedAccountId=="chainscore1.testnet") window.location.href = '/teacher-dashboard';
          if(signedAccountId=="chainscore2.testnet") window.location.href = '/student-dashboard';
          if(signedAccountId=="chainscore3.testnet") window.location.href = '/student-dashboard';
        }
      }, [loading, signedAccountId]);

    return (
        <main>
            <div className='w-100 text-end align-text-center'></div>
            <div className={`${styles.fullHeightBackground} d-flex flex-column justify-content-start`}>
                <div className="container">
                    <h1 className="mb-2">Create, Test, Grade</h1>
                    <h2 className="mb-2"><strong>Securely with ChainScore</strong></h2>
                    <p>Utilize ChainScore to send & receive encrypted tests via smart contracts directly to students.</p>
                </div>
            </div>
        </main>
    );
}
