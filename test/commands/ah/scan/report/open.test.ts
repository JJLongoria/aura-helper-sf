// import { TestContext } from '@salesforce/core/lib/testSetup';
// import { expect } from 'chai';
// import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
// import AhScanReportOpen from '..\\..\\..\\..\\..\\src\\commands\\ah\\scan\\report\\open';

describe('ah scan report open', () => {
  // const $$ = new TestContext();
  // let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

  beforeEach(() => {
    // sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    // $$.restore();
  });

  it('runs hello', async () => {
    // await AhScanReportOpen.run([]);
    // const output = sfCommandStubs.log
    //   .getCalls()
    //   .flatMap((c) => c.args)
    //   .join('\n');
    // expect(output).to.include('hello world');
  });

  it('runs hello with --json and no provided name', async () => {
    // const result = await AhScanReportOpen.run([]);
    // expect(result.path).to.equal('G:\\Workspace\\SFDX\\sf-aura-helper\\src\\commands\\ah\\scan\\report\\open.ts');
  });

  it('runs hello world --name Astro', async () => {
    // await AhScanReportOpen.run(['--name', 'Astro']);
    // const output = sfCommandStubs.log
    //   .getCalls()
    //   .flatMap((c) => c.args)
    //   .join('\n');
    // expect(output).to.include('hello Astro');
  });
});
