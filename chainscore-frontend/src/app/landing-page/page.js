'use client';

import styles from './landing.module.css';
import { useState, useEffect, useContext } from 'react';

export default function LandingPage() {
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
