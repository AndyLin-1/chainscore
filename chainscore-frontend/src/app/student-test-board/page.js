'use client';

import styles from './studenttestboard.module.css';
import testData from './testData.json';
import { useEffect, useContext, useState} from 'react';
import { NearContext } from '@/context';


export default function StudentTestBoard() {
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

  const testId = 0;
  const test = testData.tests.find(t => t.id === testId);

  if (!test) {
    return <div>Test not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{test.name}</h1>
      <p>Deadline Date: {test.deadlineDate}</p>
      {/* Add more test details and functionality here */}
    </div>
  );
}
