'use client';

import { useState } from 'react';
import styles from './TeacherDashboard.module.css';
import { FaClipboardList } from 'react-icons/fa';
import testData from './testData.json';
import { useRouter } from 'next/router';

export default function TeacherDashboard() {
  const router = useRouter();
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
    console.log('Test Name:', testName);
    console.log('Start Time:', startTime);
    console.log('End Time:', endTime);

    router.push({
      pathname: '/teacher-test-create', 
      query: { testName, startTime, endTime },
    });
  };

  const currentDate = new Date();
  const activeTests = testData.tests.filter(test => new Date(test.deadlineDate) >= currentDate);
  const inactiveTests = testData.tests.filter(test => new Date(test.deadlineDate) < currentDate);

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
          <h1>Teacher Dashboard</h1>
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
          <button className={styles.button} onClick={handleButtonClick}>Add Test</button>
        </div>
        <div>
          {activeTab === 'active' ? (
            activeTests.map((test, index) => (
              <div key={index} className={styles.testBox}>
                <h3>{test.name}</h3>
                <p>Published Date: {test.publishedDate}</p>
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
              <h5>Add Test</h5>
              <button type="button" className={styles.closeButton} onClick={handleClosePopout}>&times;</button>
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
              <button className={styles.button} onClick={handleClosePopout}>Close</button>
              <button className={styles.button} onClick={handleContinue}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
