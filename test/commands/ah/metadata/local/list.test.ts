import { TestContext } from '@salesforce/core/lib/testSetup';
// import { expect } from 'chai';
// import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
// import AhMetadataLocalList from '..\\..\\..\\..\\..\\src\\commands\\ah\\metadata\\local\\list';

describe('ah metadata local list', () => {
  const $$ = new TestContext();
  // let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

  beforeEach(() => {
    // sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  it('runs hello', async () => {
    // await AhMetadataLocalList.run([]);
    // const output = sfCommandStubs.log
    //   .getCalls()
    //   .flatMap((c) => c.args)
    //   .join('\n');
    // expect(output).to.include('hello world');
  });

  it('runs hello with --json and no provided name', async () => {
    // const result = await AhMetadataLocalList.run([]);
    // expect(result.path).to.equal('G:\\Workspace\\SFDX\\sf-aura-helper\\src\\commands\\ah\\metadata\\local\\list.ts');
  });

  it('runs hello world --name Astro', async () => {
    // await AhMetadataLocalList.run(['--name', 'Astro']);
    // const output = sfCommandStubs.log
    //   .getCalls()
    //   .flatMap((c) => c.args)
    //   .join('\n');
    // expect(output).to.include('hello Astro');
  });
});
