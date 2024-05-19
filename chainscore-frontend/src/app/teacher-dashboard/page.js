'use client';

import { useState, useContext, useEffect } from 'react';
import styles from './TeacherDashboard.module.css';
import { FaClipboardList } from 'react-icons/fa';
import { SVGProps } from 'react';
import { Icon } from '@iconify/react';
import testData from './testData.json'
import { NearContext } from '@/context';

export default function TeacherDashboard() {
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

  const [activeTab, setActiveTab] = useState('active');
  const [showPopout, setShowPopout] = useState(false);
  const [testName, setTestName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleButtonClick = () => {
    setShowPopout(true);
  };

  const handleClosePopout = () => {
    setShowPopout(false);
  };

  const handleContinue = () => {
    if(!(testName == "" || startTime == "" || endTime == "")) {
      window.location.href  = `/teacher-test-create?testName=${testName}&startTime=${startTime}&endTime=${endTime}`; 
    } 
  };

  const currentDate = new Date();
  const activeTests = testData.tests.filter(test => new Date(test.deadlineDate) >= currentDate);
  const inactiveTests = testData.tests.filter(test => new Date(test.deadlineDate) < currentDate);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <button className={`${styles.sidebarButton} ${activeTab === 'active' ? styles.active : ''}`}
              onClick={() => setActiveTab('active')}>
          <Icon icon="mdi:form" className={styles.sidebarButtonIcon}/>
          Tests
        </button>
        <button className={`${styles.sidebarButton} ${activeTab === 'inactive' ? styles.active : ''}`}
              onClick={() => setActiveTab('inactive')}>
          <Icon icon="material-symbols:history" className={styles.sidebarButtonIcon}/>
          Sent History
        </button>
      </div>
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Review your tests</h1>
        </div>

        <div className={styles.header}>
          <ul className={styles.tabs}>
            <li
              className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Tests
            </li>
            <li
              className={`${styles.tab} ${activeTab === 'inactive' ? styles.active : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              Inactive Tests
            </li>
          </ul>
          <button className={styles.button} onClick={handleButtonClick}>Create a test</button>
        </div>
        <div>
          {activeTab === 'active' ? (
            activeTests.map((test, index) => (
              <div key={index} className={styles.testBox}>
                <h3>{test.name}</h3>
                <p>Deadline Date: {test.deadlineDate}</p>
              </div>
            ))
          ) : (
            inactiveTests.map((test, index) => (
              <div key={index} className={styles.testBox}>
                <h3>{test.name}</h3>
                <p>Deadline Date: {test.deadlineDate}</p>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Popout modal */}
      {showPopout && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h5>Add required fields for your test</h5>

              <button onClick={handleClosePopout} className={styles.closeButton}>
                <Icon icon="material-symbols:close" className={styles.sidebarButtonIcon}/>
              </button>
              
            </div>
            <div className={styles.modalBody}>
              <input
                type="text"
                placeholder="Test Name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
              <input
                type="datetime-local"
                placeholder="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                step="3600"
              />
              <input
                type="datetime-local"
                placeholder="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                step="3600"
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.button} onClick={handleContinue}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
