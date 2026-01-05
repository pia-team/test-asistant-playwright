// cucumber.js
console.log(">>> CUCUMBER CONFIG LOADED <<<");

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'support/world.ts',
      'support/hooks.ts'
      // NOTE: Step files are NOT included here!
      // They are dynamically added via CLI --require arguments
      // to prevent "Multiple step definitions match" errors
      // when running specific feature files.
    ],
    publishQuiet: false,
    format: [
      'summary',
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'rerun:reports/rerun.txt',
      'allure-cucumberjs/reporter'
      //'cucumberjs-allure2-reporter'
    ],
    tags: 'not @ignore',
    // paths removed - CLI paths will be used for file-based execution
    // paths: ['features/**/*.feature'],
    timeout: 60_000,
    parallel: 3,               // paralel koşu değerini buradan yönetiyoruz
    retry: 0,                // ⬅️ FAIL olan senaryoları 1 kez daha dene (toplam 3)
    // retryTagFilter: '@flaky' // (opsiyonel) sadece @flaky etiketlilere retry uygula
    dryRun: false             //"senaryo çalışmadan önce step var mı?" kontrolü yapmakiçin true yap
  },

  rerun: {
    requireModule: ['ts-node/register'],
    require: [
      'support/world.ts',
      'support/hooks.ts'
      // Step files dynamically added via CLI
    ],
    publishQuiet: false,
    format: [
      'summary',
      'progress',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'rerun:reports/rerun.txt',
      'allure-cucumberjs/reporter'
      //'cucumberjs-allure2-reporter'
    ],
    paths: ['@reports/rerun.txt'],
    timeout: 60_000,
    // parallel: 2,
    retry: 1                 // ⬅️ Rerun profilinde de aynı
  }
};
