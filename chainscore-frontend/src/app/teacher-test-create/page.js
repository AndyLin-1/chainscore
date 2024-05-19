'use client';

import styles from './teachertestcreate.module.css'; 
import { useEffect, useState } from 'react';
import queryString from 'query-string';


const TeacherTestCreate = () => {
  const [testName, setTestName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { testName, startTime, endTime } = queryString.parse(window.location.search);
        setTestName(testName || '');
        setStartTime(startTime || '');
        setEndTime(endTime || '');
    }
  }, []);

  const addQuestion = (type) => {
    setQuestions([...questions, { type, question: '', options: [] }]);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = questions.slice();
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addOption = (index) => {
    const newQuestions = questions.slice();
    newQuestions[index].options.push('');
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = questions.slice();
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSendTest = () => {
    const testContent = {
      testName,
      startTime,
      endTime,
      questions
    };
    const jsonContent = JSON.stringify(testContent);
    console.log(jsonContent);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2 className={styles.title}>Add Test Content</h2>
        <ul className={styles.sidebarList}>
          <li className={styles.sidebarItem} onClick={() => addQuestion('shortText')}>Short Text Field</li>
          <li className={styles.sidebarItem} onClick={() => addQuestion('longText')}>Long Text Field</li>
          <li className={styles.sidebarItem} onClick={() => addQuestion('multipleChoice')}>Multiple Choice</li>
          <li className={styles.sidebarItem} onClick={() => addQuestion('dropdown')}>Dropdown</li>
        </ul>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Teacher Test Create</h1>
        </div>
        <div className={styles.boxRow}>
          <div className={styles.box}>
            <h3>Test Name</h3>
            <p>{testName}</p>
          </div>
          <div className={styles.box}>
            <h3>Start Time</h3>
            <p>{startTime}</p>
          </div>
          <div className={styles.box}>
            <h3>End Time</h3>
            <p>{endTime}</p>
          </div>
        </div>

        <div className={styles.testContentHeader}>
          <h2>Test Content</h2>
          <button className={styles.button} onClick={handleSendTest}>Send Test</button>
        </div>

       <div className={styles.questionsArea}>
          {questions.map((question, index) => (
            <div key={index} className={styles.questionBox}>
              <div className={styles.questionHeader}>
                <h4>{question.type.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <button className={styles.deleteButton} onClick={() => deleteQuestion(index)}>Delete</button>
              </div>
              <input
                type="text"
                placeholder="Question"
                value={question.question}
                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                className={styles.inputField}
              />
              {['multipleChoice', 'dropdown'].includes(question.type) && (
                <div>
                  {question.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, oIndex, e.target.value)}
                      className={styles.inputField}
                    />
                  ))}
                  <button className={styles.addButton} onClick={() => addOption(index)}>Add Option</button>
                </div>
              )}
              {question.type === 'shortText' && (
                <input type="text" placeholder="Short answer" className={styles.inputField} disabled />
              )}
              {question.type === 'longText' && (
                <textarea placeholder="Long answer" className={styles.inputField} disabled />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherTestCreate;