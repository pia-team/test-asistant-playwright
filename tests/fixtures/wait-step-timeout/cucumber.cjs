module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'tests/fixtures/wait-step-timeout/support.ts',
      'tests/fixtures/wait-step-timeout/steps.ts',
    ],
    paths: ['tests/fixtures/wait-step-timeout/wait.feature'],
    parallel: 0,
    retry: 0,
    format: ['summary'],
  },
};
