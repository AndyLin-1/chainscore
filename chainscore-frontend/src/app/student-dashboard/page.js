'use client';

import { useState, useContext, useEffect } from 'react';
import styles from './studentdashboard.module.css';
import { FaClipboardList } from 'react-icons/fa';
import testData from './testData.json';
import { NearContext } from '@/context';


export default function StudentDashboard() {
    const { signedAccountId } = useContext(NearContext);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setLoading(false);
    }, [signedAccountId]);

    useEffect(() => {
        if (!loading && !signedAccountId) {
          window.location.href = '/';
        }
      }, [loading, signedAccountId]);

  const [activeTab, setActiveTab] = useState('open');
  const currentDate = new Date();
  const openTests = testData.tests.filter(test => new Date(test.deadlineDate) >= currentDate && !test.graded);
  const gradedTests = testData.tests.filter(test => test.graded);

  
  const handleTestClick = (testId) => {
    window.location.href  = `/student-test-board${testId}`; 
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <button className={styles.sidebarButton}>
          <FaClipboardList className={styles.sidebarButtonIcon} />
          Tests
        </button>
      </div>
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Student Dashboard</h1>
        </div>
        <div className={styles.header}>
          <ul className={styles.tabs}>
            <li
              className={`${styles.tab} ${activeTab === 'open' ? styles.active : ''}`}
              onClick={() => setActiveTab('open')}
            >
              Open Tests
            </li>
            <li
              className={`${styles.tab} ${activeTab === 'graded' ? styles.active : ''}`}
              onClick={() => setActiveTab('graded')}
            >
              Graded Tests
            </li>
          </ul>
        </div>
        <div>
          {activeTab === 'open' ? (
            openTests.map((test, index) => (
              <div key={index} className={styles.testBox} onClick={() => handleTestClick(test.id)}>
                <h3>{test.name}</h3>
                <p>Deadline Date: {test.deadlineDate}</p>
              </div>
            ))
          ) : (
            gradedTests.map((test, index) => (
              <div key={index} className={styles.testBox}>
                <h3>{test.name}</h3>
                <p>Grade: {test.grade}</p>
                <p>Deadline Date: {test.deadlineDate}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}