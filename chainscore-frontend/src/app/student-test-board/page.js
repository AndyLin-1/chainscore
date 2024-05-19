'use client';

import styles from './studenttestboard.module.css';
import testData from './testData.json';

export default function StudentTestBoard() {
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
