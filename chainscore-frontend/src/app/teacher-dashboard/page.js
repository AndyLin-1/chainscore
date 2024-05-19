'use client';
import { useState, useContext, useEffect } from 'react';
import styles from './TeacherDashboard.module.css';
import { Icon } from '@iconify/react';
import { NearContext } from '@/context';
import { ChainScoreContract } from '@/config';

const CONTRACT = ChainScoreContract;

export default function TeacherDashboard() {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState({ active: [], inactive: [] });
  const [activeTab, setActiveTab] = useState('active');
  const [showPopout, setShowPopout] = useState(false);
  const [testName, setTestName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [activeTests, setActiveTests] = useState([]);
  const [inactiveTests, setInactiveTests] = useState([]);
  

  useEffect(() => {
    async function fetchTestData() {
      try {
        let data = await wallet.callMethod({
          contractId: CONTRACT,
          method: 'get_all_tests',
          args: { teacherAccountId: signedAccountId }
        });

        if (!data) {
          data = [];
        }

        const currentDate = new Date();
        const activeTests = data.filter(test => new Date(test.endDate) >= currentDate);
        const inactiveTests = data.filter(test => new Date(test.endDate) < currentDate);

        setTestData({ active: activeTests, inactive: inactiveTests });
      } catch (error) {
        console.error('Failed to fetch test data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (signedAccountId) {
      fetchTestData();
    }
  }, [signedAccountId, wallet]);

  useEffect(() => {
    const currentDate = new Date();
    const filteredActiveTests = testData.active.filter(test => new Date(test.endDate) >= currentDate);
    const filteredInactiveTests = testData.inactive.filter(test => new Date(test.endDate) < currentDate);
    setActiveTests(filteredActiveTests);
    setInactiveTests(filteredInactiveTests);
  }, [testData]);

  const handleButtonClick = () => {
    setShowPopout(true);
  };

  const handleClosePopout = () => {
    setShowPopout(false);
  };

  const handleContinue = () => {
    if (!(testName === "" || startTime === "" || endTime === "")) {
      window.location.href = `/teacher-test-create?testName=${testName}&startTime=${startTime}&endTime=${endTime}`;
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {/* Conditional rendering */}
        {!loading && (
          <>
            <button
              className={`${styles.sidebarButton} ${activeTab === 'active' ? styles.active : ''}`}
              onClick={() => setActiveTab('active')}
            >
              <Icon icon="mdi:form" className={styles.sidebarButtonIcon}/>
              Tests
            </button>
            <button
              className={`${styles.sidebarButton} ${activeTab === 'inactive' ? styles.active : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              <Icon icon="material-symbols:history" className={styles.sidebarButtonIcon}/>
              Sent History
            </button>
          </>
        )}
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
