// cucumber.js
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'support/world.ts',
      'support/hooks.ts',
      'features/steps/**/*.ts'
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
    paths: ['features/**/*.feature'],
    timeout: 60_000,
    parallel: 3,               // paralel koşu değerini buradan yönetiyoruz
    retry: 1 ,                // ⬅️ FAIL olan senaryoları 1 kez daha dene (toplam 3)
    // retryTagFilter: '@flaky' // (opsiyonel) sadece @flaky etiketlilere retry uygula
    dryRun:false             //"senaryo çalışmadan önce step var mı?" kontrolü yapmakiçin true yap
  },

  rerun: {
    requireModule: ['ts-node/register'],
    require: [
      'support/world.ts',
      'support/hooks.ts',
      'features/steps/**/*.ts'
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
