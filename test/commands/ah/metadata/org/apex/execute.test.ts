import { TestContext } from '@salesforce/core/lib/testSetup';
// import { expect } from 'chai';
// import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
// import AhMetadataOrgApexExecute from '..\\..\\..\\..\\..\\..\\src\\commands\\ah\\metadata\\org\\apex\\execute'

describe('ah metadata org apex execute', () => {
  const $$ = new TestContext();
  // let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

  beforeEach(() => {
    // sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  it('runs hello', async () => {
    // await AhMetadataOrgApexExecute.run([])
    // const output = sfCommandStubs.log
    //   .getCalls()
    //   .flatMap((c) => c.args)
    //   .join('\n');
    // expect(output).to.include('hello world');
  });

  it('runs hello with --json and no provided name', async () => {
    // const result = await AhMetadataOrgApexExecute.run([]);
    // expect(result.path).to.equal('G:\\Workspace\\SFDX\\sf-aura-helper\\src\\commands\\ah\\metadata\\org\\apex\\execute.ts');
  });

  it('runs hello world --name Astro', async () => {
    // await AhMetadataOrgApexExecute.run(['--name', 'Astro']);
    // const output = sfCommandStubs.log
    //   .getCalls()
    //   .flatMap((c) => c.args)
    //   .join('\n');
    // expect(output).to.include('hello Astro');
  });
});
