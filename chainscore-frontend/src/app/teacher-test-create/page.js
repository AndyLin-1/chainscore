'use client';

import styles from './teachertestcreate.module.css'; 
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TeacherTestCreate = () => {
  const router = useRouter();
  const { testName, startTime, endTime } = router.query;
 
  const [isQueryReady, setIsQueryReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && testName && startTime && endTime) {
      setIsQueryReady(true);
    }
  }, [testName, startTime, endTime]);

  if (!isQueryReady) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>New Page</h1>
      <p>Variable 1: {var1}</p>
      <p>Variable 2: {var2}</p>
      <p>Variable 3: {var3}</p>
    </div>
  );
};

export default TeacherTestCreate;
