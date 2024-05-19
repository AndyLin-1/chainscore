// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, UnorderedMap } from 'near-sdk-js';

@NearBindgen({})
class TestContract {
  tests: UnorderedMap<Test>;
  teacher: string;
  student: string;

  constructor(teacher: string, student: string) {
    this.tests = new UnorderedMap('tests');
    this.teacher = 'chainscore1.testnet';
    this.student = 'chainscore2.testnet';
  }

  @call({})
  create_test({id, encryptedTest}: {id:string; encryptedTest: string;}) {
    if(near.predecessorAccountId() !== this.teacher) {
      throw new Error("Only teachers can create tests");
    }
    if (this.tests.get(id)) {
      throw new Error("Test with this ID already exists");
    }
    const test = new Test(id, encryptedTest);
    this.tests.set(id, test);
  } 


  @view({})
  get_test({ id}: { id: string }): Test | null {
    return this.tests.get(id);
  }

  @call({})
  submit_response({ id, encryptedResponse }: { id: string; encryptedResponse: string }) {
    const test = this.tests.get(id);
    if (!test) {
      throw new Error('Test not found');
    }
    if (this.teacher === near.predecessorAccountId()) {
      throw new Error('Teacher cannot submit a response');
    }
    test.encryptedResponse = encryptedResponse;
    this.tests.set(id, test);
  }
}

@NearBindgen ({})
class Test {
  id: string;
  encryptedTest: string;
  encryptedResponse: string | null;

  constructor(id: string, encryptedTest: string) {
    this.id = id;
    this.encryptedTest = encryptedTest;
    this.encryptedResponse = null;
  }
}

