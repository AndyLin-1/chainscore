import { NearBindgen, near, call, view, UnorderedMap, UnknownCurve} from 'near-sdk-js';

@NearBindgen({})
class TestContract {
  tests: UnorderedMap<Test>;
  teacher: string;

  constructor() {
    this.tests = new UnorderedMap<Test>('tests');
    this.teacher = 'chainscore1.testnet'; 
  }

  @call({})
  create_test({ name, questions, startDate, endDate }: { name: string; questions: string; startDate: Date; endDate: Date }) {
    if(near.predecessorAccountId() !== this.teacher) {
      throw new Error("Only teachers can create tests");
    }
    const id = name + '_' + startDate.toString(); // Generating unique ID based on test name and start date
    if (this.tests.get(id) !== null) {
      throw new Error("Test with this name and start date already exists");
    }
    const test = new Test(name, questions, startDate, endDate);
    this.tests.set(id, test);
  } 

  @view({})
  get_test({ id }: { id: string }): testInfo | null {
    const test = this.tests.get(id);
    if(test !== null) {
      return new testInfo(test.name, test.questions, test.startDate, test.endDate);
    }
    return null;
  }

  @call({})
  get_all_tests({ teacherAccountId }: { teacherAccountId: string }): testInfo[] {
    if (near.predecessorAccountId() !== teacherAccountId) {
      throw new Error('Unauthorized to access all tests');
    }

    const allTests: testInfo[] = [];
    const testsKeys = this.tests.keys({ start: '', limit: 10 });
    for (let i = 0; i < testsKeys.length; i++) {
      const test = this.tests.get(testsKeys[i]);
      if (test !== null) {
        allTests.push(new testInfo(test.name, test.questions, test.startDate, test.endDate));
      }
    }

    return allTests;
  }

  @call({})
  get_all_open_tests( ): testInfo[] {
    const allTests: testInfo[] = [];
    const testsKeys = this.tests.keys({ start: '', limit: 10 });
    for (let i = 0; i < testsKeys.length; i++) {
      const test = this.tests.get(testsKeys[i]);
      if (test !== null) {
            allTests.push(new testInfo(test.name, test.questions, test.startDate, test.endDate));
        }
    }
    return allTests;
  }
  


  @call({})
  submit_response({ id, encryptedResponse }: { id: string; encryptedResponse: string }) {
    const test = this.tests.get(id);
    if (test === null) {
      throw new Error('Test not found');
    }
    if (near.predecessorAccountId() === this.teacher) {
      throw new Error('Teacher cannot submit a response');
    }
    if (test.endDate.getTime() < Date.now()) {
      throw new Error('Test submission period has ended');
    }
    test.studentResponses.set(near.predecessorAccountId(), encryptedResponse);
    this.tests.set(id, test);
  }

  @call({})
  write_student_marks({ id, studentId, marks }: { id: string; studentId: string; marks: number }) {
    const test = this.tests.get(id);
    if (test === null) {
      throw new Error('Test not found');
    }
    if (near.predecessorAccountId() !== this.teacher) {
      throw new Error('Only teachers can write student marks');
    }
    if (test.studentResponses.get(studentId) === null) {
      throw new Error('No response submitted by this student for the test');
    }
    test.studentMarks.set(studentId, marks);
    this.tests.set(id, test);
  }

  @call({})
  view_student_marks({ studentId }: { studentId: string }): testGrade [] {
    if (near.predecessorAccountId() !== this.teacher && near.predecessorAccountId() !== studentId) {
      throw new Error('Unauthorized to view marks for this test');
    }
    const allMarks: testGrade[] = [];

    const testsKeys = this.tests.keys({ start: '', limit: 10 }); // Assuming a reasonable limit
    for (let i = 0; i < testsKeys.length; i++) {
      const test = this.tests.get(testsKeys[i]);
      if (test !== null && test.studentMarks.get(studentId) !== null) {
        allMarks.push(new testGrade(test.name, new Date(test.endDate).getTime(), true, test.studentMarks.get(studentId)));
      }
    }

    return allMarks;
  }
}

@NearBindgen({})
class Test {
  name: string;
  questions: string;
  startDate: Date;
  endDate: Date;
  studentResponses: UnorderedMap<string>; // Map of student wallet ids to answers
  studentMarks: UnorderedMap<number>; // Map of student ids to marks

  constructor(name: string, questions: string, startDate: Date, endDate: Date) {
    this.name = name;
    this.questions = questions;
    this.startDate = startDate;
    this.endDate = endDate;
    this.studentResponses = new UnorderedMap<string>('sr_' + name); // Unique storage for each test
    this.studentMarks = new UnorderedMap<number>('sm_' + name); // Unique storage for each test
  }
}

@NearBindgen({})
class testInfo {
  name: string;
  questions: string;
  startDate: Date;
  endDate: Date;

  constructor(name: string, questions: string, startDate: Date, endDate: Date) {
    this.name = name;
    this.questions = questions;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

@NearBindgen({})
class testGrade {
  name: string;
  deadlineDate: number;
  graded: boolean;
  grade: number;

  constructor(name: string, deadlineDate: number, graded: boolean, grade: number) {
    this.name = name;
    this.deadlineDate = deadlineDate;
    this.graded = graded;
    this.grade = grade;
  }
}

