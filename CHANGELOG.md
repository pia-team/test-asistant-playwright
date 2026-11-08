# test-asistant-playwright — Geliştirme günlüğü

Kullanım: [ortak changelog rehberi](../CHANGELOG.md). Sürümler geliştirme ledger'ına aittir; deploy/paket yayını değildir.
Kayıtlar eklenme sırasıyla tutulur. Minor = yeni yetenek; patch = düzeltme/iyileştirme/bakım.
Başlangıç: `1.0.0` (manifest: `1.0.0`). Önceki sürümler tahmin edilmemiştir.
Geçmiş: [Git arşivi](docs/changelog/history.md). Release notlarına kendiliğinden dahil edilmez.

<!-- CHANGELOG:BASELINE {"date": "2026-10-22T13:47:26+03:00", "git_head": "40f353eab585cd64e68a4e77ddc840c4a2f8c2e6", "manifest_version": "1.0.0", "note": "Ledger starting point only; not a historical release claim", "version": "1.0.0"} -->

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-10-24T00:12:20+03:00", "evidence": "Finding 3: manifest mode disables legacy fallback; tests/testData.manifestPreflight.test.ts → 6 pass; npm test dataset+preflight green; tsc --noEmit ok", "id": "2026-10-24-ct-feat-001-wp7-run-preflight", "summary": "WEB runner testData.getFile, Data Center manifest varken legacy demo path kullanmaz; eksik binding PREFLIGHT verir. Manifest yokken demo key legacy davranışı korunur.", "title": "WEB runner manifest safety for getFile", "version": "1.1.0"} -->
## 1.1.0 — WEB runner manifest safety for getFile

WEB runner testData.getFile, Data Center manifest varken legacy demo path kullanmaz; eksik binding PREFLIGHT verir. Manifest yokken demo key legacy davranışı korunur.

Kanıt / doğrulama: Finding 3: manifest mode disables legacy fallback; tests/testData.manifestPreflight.test.ts → 6 pass; npm test dataset+preflight green; tsc --noEmit ok

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-24T00:25:21+03:00", "evidence": "node --test tests/testData.dataset.test.ts tests/testData.manifestPreflight.test.ts → 9 pass", "id": "2026-10-24-ct-feat-001-wp8-release-readiness", "summary": "CT-FEAT-001 WP8: WEB testData manifest güvenliği ve dataset contract testleri yeniden doğrulandı; legacy fallback yalnızca manifest yokken.", "title": "Unified Test Resources WP8 release readiness", "version": "1.1.1"} -->
## 1.1.1 — Unified Test Resources WP8 release readiness

CT-FEAT-001 WP8: WEB testData manifest güvenliği ve dataset contract testleri yeniden doğrulandı; legacy fallback yalnızca manifest yokken.

Kanıt / doğrulama: node --test tests/testData.dataset.test.ts tests/testData.manifestPreflight.test.ts → 9 pass

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-10-25T00:28:01+03:00", "evidence": "support/snapshot-resolve-locator.ts", "id": "slice-c-snapshot-resolve-locator", "summary": "Adds shared Playwright resolveStructuredLocator for Snapshot compiled steps with ambiguous-match rejection and runtime credential env fills.", "title": "Snapshot structured locator runner support", "version": "1.2.0"} -->
## 1.2.0 — Snapshot structured locator runner support

Adds shared Playwright resolveStructuredLocator for Snapshot compiled steps with ambiguous-match rejection and runtime credential env fills.

Kanıt / doğrulama: support/snapshot-resolve-locator.ts

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-25T00:49:10+03:00", "evidence": "support/snapshot-resolve-locator.ts resolveSnapshotNavigateUrl; cucumber IT not re-run this turn.", "id": "slice-e-access-cleanup-rollout", "summary": "Runner maps known fixture:// Snapshot URLs to local HTML and rejects other origins.", "title": "Fixture navigate URL resolve", "version": "1.2.1"} -->
## 1.2.1 — Fixture navigate URL resolve

Runner maps known fixture:// Snapshot URLs to local HTML and rejects other origins.

Kanıt / doğrulama: support/snapshot-resolve-locator.ts resolveSnapshotNavigateUrl; cucumber IT not re-run this turn.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-25T01:00:20+03:00", "evidence": "support/snapshot-resolve-locator.ts; fixture IT included in Maven run.", "id": "slice-f-http-targets", "summary": "Runner resolveSnapshotNavigateUrl accepts allowlisted http(s) origins in addition to fixture://.", "title": "Snapshot navigate allowlist resolve", "version": "1.2.2"} -->
## 1.2.2 — Snapshot navigate allowlist resolve

Runner resolveSnapshotNavigateUrl accepts allowlisted http(s) origins in addition to fixture://.

Kanıt / doğrulama: support/snapshot-resolve-locator.ts; fixture IT included in Maven run.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-25T01:09:05+03:00", "evidence": "support/world.ts; no cucumber E2E this turn.", "id": "slice-g-storage-state", "summary": "Cucumber world loads COTESTER_SNAPSHOT_STORAGE_STATE_PATH into the browser context when present.", "title": "Apply Snapshot storageState path in world", "version": "1.2.3"} -->
## 1.2.3 — Apply Snapshot storageState path in world

Cucumber world loads COTESTER_SNAPSHOT_STORAGE_STATE_PATH into the browser context when present.

Kanıt / doğrulama: support/world.ts; no cucumber E2E this turn.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-25T22:16:05+03:00", "evidence": "fixtures/snapshot/css-icon-link.html; duplicate-fields.html", "id": "snapshot-element-metadata-href-resolve", "summary": "Authoring/runner fixture’larına CSS ::before ikonlu link ve aynı adlı alan bölümleri eklendi.", "title": "Snapshot fixture A/B (CSS ikon link, yinelenen alanlar)", "version": "1.2.4"} -->
## 1.2.4 — Snapshot fixture A/B (CSS ikon link, yinelenen alanlar)

Authoring/runner fixture’larına CSS ::before ikonlu link ve aynı adlı alan bölümleri eklendi.

Kanıt / doğrulama: fixtures/snapshot/css-icon-link.html; duplicate-fields.html

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-26T00:00:10+03:00", "evidence": "support/playwright-browsers-path.ts; support/hooks.ts", "id": "local-chromium-pin-default-cache-web", "summary": "hooks.ts, bozuk PLAYWRIGHT_BROWSERS_PATH varken ~/Library/Caches/ms-playwright kullanır.", "title": "Cucumber öncesi Playwright browser path heal", "version": "1.2.5"} -->
## 1.2.5 — Cucumber öncesi Playwright browser path heal

hooks.ts, bozuk PLAYWRIGHT_BROWSERS_PATH varken ~/Library/Caches/ms-playwright kullanır.

Kanıt / doğrulama: support/playwright-browsers-path.ts; support/hooks.ts

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-26T00:58:26+03:00", "evidence": "rm features/snapshot features/vela support/snapshot-resolve-locator.ts", "id": "slice-k8-2-ai-path-per-test-resolve", "summary": "features/snapshot, features/steps/snapshot, features/vela ve paylaşımlı support/snapshot-resolve-locator.ts diskten kaldırıldı; AI Practice testleri korundu.", "title": "Eski deterministik snapshot/vela kalıntıları temizlendi", "version": "1.2.6"} -->
## 1.2.6 — Eski deterministik snapshot/vela kalıntıları temizlendi

features/snapshot, features/steps/snapshot, features/vela ve paylaşımlı support/snapshot-resolve-locator.ts diskten kaldırıldı; AI Practice testleri korundu.

Kanıt / doğrulama: rm features/snapshot features/vela support/snapshot-resolve-locator.ts

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-26T01:12:14+03:00", "evidence": "cucumber-js features/Orange/vela/vela.feature: TS role/uiValue hataları giderildi; 1 scenario keşfedildi.", "id": "2026-10-26-deterministic-tags-resolve-ts", "summary": "Mevcut deterministik artifact yeniden publish edilmeden cucumber step yükleyebilir.", "title": "Orange/vela resolve ve steps TS derleme düzeltmesi", "version": "1.2.7"} -->
## 1.2.7 — Orange/vela resolve ve steps TS derleme düzeltmesi

Mevcut deterministik artifact yeniden publish edilmeden cucumber step yükleyebilir.

Kanıt / doğrulama: cucumber-js features/Orange/vela/vela.feature: TS role/uiValue hataları giderildi; 1 scenario keşfedildi.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-26T01:35:03+03:00", "evidence": "features/steps/**/*.resolve.ts COTESTER_WEB_BASE_URL / BASE_LOGIN_URL fallback.", "id": "2026-10-26-matching-env-navigate", "summary": "Mevcut deterministik resolve dosyaları seçilen WEB ortamı URL'sini kullanabilir.", "title": "Per-test resolve env:// URL fallback", "version": "1.2.8"} -->
## 1.2.8 — Per-test resolve env:// URL fallback

Mevcut deterministik resolve dosyaları seçilen WEB ortamı URL'sini kullanabilir.

Kanıt / doğrulama: features/steps/**/*.resolve.ts COTESTER_WEB_BASE_URL / BASE_LOGIN_URL fallback.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-26T01:44:47+03:00", "evidence": "Kalan: features/Orange/vela/vela-login-3.*; cucumber dry-run OK.", "id": "2026-10-26-cucumber-escape-env-slash", "summary": "Güncel login-3 step escape düzeltildi; vela ve vela-login-2 artifact'ları kaldırıldı.", "title": "vela-login-3 slash escape; eski vela kalıntıları silindi", "version": "1.2.9"} -->
## 1.2.9 — vela-login-3 slash escape; eski vela kalıntıları silindi

Güncel login-3 step escape düzeltildi; vela ve vela-login-2 artifact'ları kaldırıldı.

Kanıt / doğrulama: Kalan: features/Orange/vela/vela-login-3.*; cucumber dry-run OK.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-26T01:50:14+03:00", "evidence": "vela-login-3.resolve.ts pickHttpEnv.", "id": "2026-10-26-snapshot-start-url-inject", "summary": "Boş process env değerleri env:// çözümlemesini bozmaz.", "title": "vela-login-3 resolve: blank-safe env URL pick", "version": "1.2.10"} -->
## 1.2.10 — vela-login-3 resolve: blank-safe env URL pick

Boş process env değerleri env:// çözümlemesini bozmaz.

Kanıt / doğrulama: vela-login-3.resolve.ts pickHttpEnv.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-26T01:54:47+03:00", "evidence": "vela-login-3.resolve.ts / .steps.ts patched.", "id": "2026-10-26-locator-wait-after-nav", "summary": "Username fill, Keycloak/login redirect tamamlanmadan koşulmaz.", "title": "vela-login-3: locator wait + click settle", "version": "1.2.11"} -->
## 1.2.11 — vela-login-3: locator wait + click settle

Username fill, Keycloak/login redirect tamamlanmadan koşulmaz.

Kanıt / doğrulama: vela-login-3.resolve.ts / .steps.ts patched.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-10-26T21:26:23+03:00", "evidence": "tests/active-page.test.ts → 11/11 pass (headless Chromium smoke); allure-cucumberjs değiştirilmedi.", "id": "2026-10-26-bug007-active-page", "summary": "Yeni sekme/popup açılınca scenario-scoped active page güncellenir; screenshot ve step’ler doğru sekmeden alınır, sekme kapanınca önceki sayfaya dönülür.", "title": "WEB runner active page for new tabs", "version": "1.2.12"} -->
## 1.2.12 — WEB runner active page for new tabs

Yeni sekme/popup açılınca scenario-scoped active page güncellenir; screenshot ve step’ler doğru sekmeden alınır, sekme kapanınca önceki sayfaya dönülür.

Kanıt / doğrulama: tests/active-page.test.ts → 11/11 pass (headless Chromium smoke); allure-cucumberjs değiştirilmedi.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-10-29T17:39:04+03:00", "evidence": "scenarioVars unit helper testleri (4) geçti; Chromium smoke bu ortamda çalıştırılamadı.", "id": "2026-10-29-dynamic-data-ai-instructions", "summary": "Aynı senaryoda yakalanan değerler güvenli saklanır; farklı overwrite reddedilir; URL sorgu parametresi capture ve assertion helper’ları eklendi.", "title": "Senaryo değişkeni overwrite koruması ve URL capture", "version": "1.3.0"} -->
## 1.3.0 — Senaryo değişkeni overwrite koruması ve URL capture

Aynı senaryoda yakalanan değerler güvenli saklanır; farklı overwrite reddedilir; URL sorgu parametresi capture ve assertion helper’ları eklendi.

Kanıt / doğrulama: scenarioVars unit helper testleri (4) geçti; Chromium smoke bu ortamda çalıştırılamadı.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-10-30T16:03:32+03:00", "evidence": "flow-context.steps.ts: loaded from Data Center config … key …; birim/E2E koşulmadı.", "id": "2026-10-30-dc-phase1-config", "summary": "WEB runner, Data Center CONFIG anahtarını senaryo değişkenine yükleyebilir.", "title": "CONFIG anahtarından senaryo değişkeni yükleme adımı", "version": "1.4.0"} -->
## 1.4.0 — CONFIG anahtarından senaryo değişkeni yükleme adımı

WEB runner, Data Center CONFIG anahtarını senaryo değişkenine yükleyebilir.

Kanıt / doğrulama: flow-context.steps.ts: loaded from Data Center config … key …; birim/E2E koşulmadı.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-10-30T18:20:16+03:00", "evidence": "tests/step-event.test.ts 2/2 PASS; canlı Chromium E2E UNVERIFIED.", "id": "2026-10-30-pkg8-phase2-step-state-hybrid-preview", "summary": "WEB runner, kararlı step identity ve AfterStep screenshot metadata marker’larını stdout’a yazar; ham STEP START/PASS/FAIL logları korunur.", "title": "WEB structured step and screenshot markers", "version": "1.5.0"} -->
## 1.5.0 — WEB structured step and screenshot markers

WEB runner, kararlı step identity ve AfterStep screenshot metadata marker’larını stdout’a yazar; ham STEP START/PASS/FAIL logları korunur.

Kanıt / doğrulama: tests/step-event.test.ts 2/2 PASS; canlı Chromium E2E UNVERIFIED.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-10-30T21:10:42+03:00", "evidence": "tests/step-event.test.ts 4/4 PASS; Trace Viewer E2E UNVERIFIED.", "id": "2026-10-30-pkg8-phase3-step-evidence-playback", "summary": "WEB runner Trace varsayılan kapalıdır; açıkken reports/traces zip üretir ve test sonucunu bozmadan TRACE marker yazar.", "title": "Opt-in Playwright Trace with structured TRACE marker", "version": "1.6.0"} -->
## 1.6.0 — Opt-in Playwright Trace with structured TRACE marker

WEB runner Trace varsayılan kapalıdır; açıkken reports/traces zip üretir ve test sonucunu bozmadan TRACE marker yazar.

Kanıt / doğrulama: tests/step-event.test.ts 4/4 PASS; Trace Viewer E2E UNVERIFIED.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-01T16:34:43+03:00", "evidence": "./node_modules/.bin/tsc --noEmit --pretty false exit 0. tests/step-status.test.ts 1/1 PASS. Canlı senaryo koşumu yok.", "id": "2026-11-01-web-gen-stabilize", "summary": "Cucumber AfterStep durumu string literal yerine Status enum üyeleriyle karşılaştırılır; generation validation’ın kopyaladığı support/hooks.ts TS2367 üretmez.", "title": "WEB runner AfterStep enum karşılaştırması", "version": "1.6.1"} -->
## 1.6.1 — WEB runner AfterStep enum karşılaştırması

Cucumber AfterStep durumu string literal yerine Status enum üyeleriyle karşılaştırılır; generation validation’ın kopyaladığı support/hooks.ts TS2367 üretmez.

Kanıt / doğrulama: ./node_modules/.bin/tsc --noEmit --pretty false exit 0. tests/step-status.test.ts 1/1 PASS. Canlı senaryo koşumu yok.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-02T01:25:20+03:00", "evidence": "npx cucumber-js --dry-run @sim-create-1: 17 steps defined (0 undefined/ambiguous). Live TEST_ENV=test chromium: Given Keycloak FAIL because config/projects/Orange.test.json has no username/password (vault injects these only via RUN_TESTS job). Customer matched features/steps/.../sim-create-1.steps.ts:54 {string} handler; callback+promise did not fire. 0 PASS, 1 FAIL, 16 SKIPPED.", "id": "2026-11-02-cucumber-step-arity", "summary": "sim-create-1 Customer, Profile, Address 1 ve Batch adımları {string} yakalar; 2FF sabit literal kalır. Cucumber artık extra value parametresini callback sanmaz. MCP locator'ları değişmedi.", "title": "sim-create-1 Cucumber handler arity fix", "version": "1.6.2"} -->
## 1.6.2 — sim-create-1 Cucumber handler arity fix

sim-create-1 Customer, Profile, Address 1 ve Batch adımları {string} yakalar; 2FF sabit literal kalır. Cucumber artık extra value parametresini callback sanmaz. MCP locator'ları değişmedi.

Kanıt / doğrulama: npx cucumber-js --dry-run @sim-create-1: 17 steps defined (0 undefined/ambiguous). Live TEST_ENV=test chromium: Given Keycloak FAIL because config/projects/Orange.test.json has no username/password (vault injects these only via RUN_TESTS job). Customer matched features/steps/.../sim-create-1.steps.ts:54 {string} handler; callback+promise did not fire. 0 PASS, 1 FAIL, 16 SKIPPED.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-02T02:06:52+03:00", "evidence": "Önceki koşu 3be40843 adım 2FF: Playwright selectOption on button role=combobox data-testid=request-header-graph-ref. Düzeltme: getByRole('option', { name: '2FF', exact: true }).click(); Address 1 getByTestId('request-header-address-1'). npx cucumber-js --dry-run @sim-create-2: 17 steps defined. Canlı vault'lu RUN_TESTS bu turda IDE oturumu olmadığı için yeniden koşulmadı.", "id": "2026-11-02-generated-combobox-select", "summary": "sim-create-2, Graph_ref tetikleyicisine selectOption basmaz; açık listeden 2FF option'ına tıklar. Address 1 MCP testid ile doldurulur. Form Next/Single/Batch MCP'de bulunamadığı için UNRESOLVED kalır.", "title": "sim-create-2 Graph_ref 2FF combobox seçimi", "version": "1.6.3"} -->
## 1.6.3 — sim-create-2 Graph_ref 2FF combobox seçimi

sim-create-2, Graph_ref tetikleyicisine selectOption basmaz; açık listeden 2FF option'ına tıklar. Address 1 MCP testid ile doldurulur. Form Next/Single/Batch MCP'de bulunamadığı için UNRESOLVED kalır.

Kanıt / doğrulama: Önceki koşu 3be40843 adım 2FF: Playwright selectOption on button role=combobox data-testid=request-header-graph-ref. Düzeltme: getByRole('option', { name: '2FF', exact: true }).click(); Address 1 getByTestId('request-header-address-1'). npx cucumber-js --dry-run @sim-create-2: 17 steps defined. Canlı vault'lu RUN_TESTS bu turda IDE oturumu olmadığı için yeniden koşulmadı.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-11-02T14:38:42+03:00", "evidence": "tests/initial-page.test.ts 5/5 PASS. tsc --noEmit exit 0. cucumber-js --dry-run features/Orange/sim/sim-create-2.feature: 1 scenario, 12 steps skipped (defined). Canlı RUN_TESTS bu turda koşulmadı.", "id": "2026-11-02-ui-initial-navigation", "summary": "WEB runner, ilk UI adımından önce boş sayfadaysa BASE_LOGIN_URL veya WEB_BASE_URL açar; açık navigate adımını ve zaten yüklü sayfayı ikinci kez gezmez.", "title": "WEB runner first-step initial page", "version": "1.7.0"} -->
## 1.7.0 — WEB runner first-step initial page

WEB runner, ilk UI adımından önce boş sayfadaysa BASE_LOGIN_URL veya WEB_BASE_URL açar; açık navigate adımını ve zaten yüklü sayfayı ikinci kez gezmez.

Kanıt / doğrulama: tests/initial-page.test.ts 5/5 PASS. tsc --noEmit exit 0. cucumber-js --dry-run features/Orange/sim/sim-create-2.feature: 1 scenario, 12 steps skipped (defined). Canlı RUN_TESTS bu turda koşulmadı.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-02T15:27:48+03:00", "evidence": "features/steps/Orange/Yeni/filter-resource-2StepDef/filter-resource-2.steps.ts getEnvConfig() from support/env; faker/alphanumeric yok. Canlı RUN_TESTS bu turda koşulmadı.", "id": "2026-11-02-login-fill-env-profile", "summary": "filter-resource-2 username/password adımları runtimeData.faker yerine Test Run credential profilindeki getEnvConfig().username / getEnvConfig().password değerlerini doldurur.", "title": "filter-resource-2 login uses credential profile", "version": "1.7.1"} -->
## 1.7.1 — filter-resource-2 login uses credential profile

filter-resource-2 username/password adımları runtimeData.faker yerine Test Run credential profilindeki getEnvConfig().username / getEnvConfig().password değerlerini doldurur.

Kanıt / doğrulama: features/steps/Orange/Yeni/filter-resource-2StepDef/filter-resource-2.steps.ts getEnvConfig() from support/env; faker/alphanumeric yok. Canlı RUN_TESTS bu turda koşulmadı.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-02T15:37:47+03:00", "evidence": "features/steps/Orange/Yeni/create-orderStepDef/create-order.steps.ts import { getEnvConfig } from support/env; process.env.USERNAME yok. Canlı RUN_TESTS bu turda koşulmadı.", "id": "2026-11-02-login-env-local-stub", "summary": "create-order username/password adımları yerel process.env.USERNAME stub'ı yerine Test Run profilindeki getEnvConfig().username / getEnvConfig().password değerlerini doldurur.", "title": "create-order login uses credential profile", "version": "1.7.2"} -->
## 1.7.2 — create-order login uses credential profile

create-order username/password adımları yerel process.env.USERNAME stub'ı yerine Test Run profilindeki getEnvConfig().username / getEnvConfig().password değerlerini doldurur.

Kanıt / doğrulama: features/steps/Orange/Yeni/create-orderStepDef/create-order.steps.ts import { getEnvConfig } from support/env; process.env.USERNAME yok. Canlı RUN_TESTS bu turda koşulmadı.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-02T15:46:29+03:00", "evidence": "git check-ignore: features/Orange/Yeni/create-order.feature, features/steps/.../create-order.steps.ts, pages/.../create-order.page.ts, .backup/ eşleşti. git status'ta features/ ve pages/ untracked değil.", "id": "2026-11-02-gitignore-generated-ui-tests", "summary": "WEB runner features/, pages/ ve .backup/ klasörlerindeki üretilen testler GitHub'a gitmez; dosyalar diskte kalır.", "title": "Generated UI tests stay local", "version": "1.7.3"} -->
## 1.7.3 — Generated UI tests stay local

WEB runner features/, pages/ ve .backup/ klasörlerindeki üretilen testler GitHub'a gitmez; dosyalar diskte kalır.

Kanıt / doğrulama: git check-ignore: features/Orange/Yeni/create-order.feature, features/steps/.../create-order.steps.ts, pages/.../create-order.page.ts, .backup/ eşleşti. git status'ta features/ ve pages/ untracked değil.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-04T14:44:01+03:00", "evidence": "test-asistant-playwright/support/snapshot-resolve-locator.ts, features/steps/YeniProject/Resource/SIMStepDef/SIM.resolve.ts", "id": "2026-11-04-snapshot-runtime-env", "summary": "Deterministik snapshot testinde çalışma anında uuid seçildiyse, job ortamı gelmese bile alan gerçek bir uuid ile doldurulur. Job değeri varsa o kullanılır.", "title": "Runtime uuid alanı boş kalmıyor", "version": "1.7.4"} -->
## 1.7.4 — Runtime uuid alanı boş kalmıyor

Deterministik snapshot testinde çalışma anında uuid seçildiyse, job ortamı gelmese bile alan gerçek bir uuid ile doldurulur. Job değeri varsa o kullanılır.

Kanıt / doğrulama: test-asistant-playwright/support/snapshot-resolve-locator.ts, features/steps/YeniProject/Resource/SIMStepDef/SIM.resolve.ts

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-05T11:18:45+03:00", "evidence": "node --require ts-node/register/transpile-only --test tests/initial-page.test.ts tests/env-runtime-overlay.test.ts → 7 pass. URL-only config ile resolveInitialPageUrl döndü; getEnvConfig username/password eksik diye hata verdi.", "id": "2026-11-05-relative-goto-unwanted-navigation", "summary": "Sayfa açılışı, kullanıcı adı ve şifre seçilmemiş bir koşuda da ortam URL’sini okur. Eksik kimlik bilgisi yalnız giriş bilgisi istendiğinde hata verir.", "title": "Başlangıç URL’si kimlik bilgisi olmadan okunur", "version": "1.7.5"} -->
## 1.7.5 — Başlangıç URL’si kimlik bilgisi olmadan okunur

Sayfa açılışı, kullanıcı adı ve şifre seçilmemiş bir koşuda da ortam URL’sini okur. Eksik kimlik bilgisi yalnız giriş bilgisi istendiğinde hata verir.

Kanıt / doğrulama: node --require ts-node/register/transpile-only --test tests/initial-page.test.ts tests/env-runtime-overlay.test.ts → 7 pass. URL-only config ile resolveInitialPageUrl döndü; getEnvConfig username/password eksik diye hata verdi.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-11-05T16:08:47+03:00", "evidence": "PLAYWRIGHT_BROWSERS_PATH host cache ile tests/navigation-click.test.ts 6/6 geçti (2026-11-05).", "id": "2026-11-05-web-click-step-pacing", "summary": "İlk sayfa açılışı load ve sınırlı networkidle bekler. Giriş ve sidebar tıklamaları sayfa değişimini doğrular; etkisiz tıklama bir kez yeniden denenir. Adımlar arası bekleme ve sayfa hazır bekleme ortam değişkenlerinden okunur.", "title": "WEB tıklama etkisi ve adım temposu", "version": "1.8.0"} -->
## 1.8.0 — WEB tıklama etkisi ve adım temposu

İlk sayfa açılışı load ve sınırlı networkidle bekler. Giriş ve sidebar tıklamaları sayfa değişimini doğrular; etkisiz tıklama bir kez yeniden denenir. Adımlar arası bekleme ve sayfa hazır bekleme ortam değişkenlerinden okunur.

Kanıt / doğrulama: PLAYWRIGHT_BROWSERS_PATH host cache ile tests/navigation-click.test.ts 6/6 geçti (2026-11-05).

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-05T16:46:50+03:00", "evidence": "npx tsc --noEmit -p . test-asistant-playwright içinde hatasız tamamlandı (2026-11-05).", "id": "2026-11-05-healing-getbytestid-args", "summary": "Healing proxy getByTestId çağrısı bu Playwright sürümünün tek argümanlı imzasına uyarlandı; WEB runner TypeScript derlemesi tekrar geçer.", "title": "getByTestId healing derlemesi", "version": "1.8.1"} -->
## 1.8.1 — getByTestId healing derlemesi

Healing proxy getByTestId çağrısı bu Playwright sürümünün tek argümanlı imzasına uyarlandı; WEB runner TypeScript derlemesi tekrar geçer.

Kanıt / doğrulama: npx tsc --noEmit -p . test-asistant-playwright içinde hatasız tamamlandı (2026-11-05).

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-06T12:25:38+03:00", "evidence": "tests/navigation-click.test.ts 7/7; npx tsc --noEmit -p . temiz (2026-11-06).", "id": "2026-11-06-button-click-no-nav-required", "summary": "clickExpectingChange gerçek bağlantılarda URL, giriş ve sidebar butonlarında URL veya DOM değişimini kabul eder. Href'siz butonlar için yalnız URL beklenmez.", "title": "Buton tıklamasında sayfa şartı yok", "version": "1.8.2"} -->
## 1.8.2 — Buton tıklamasında sayfa şartı yok

clickExpectingChange gerçek bağlantılarda URL, giriş ve sidebar butonlarında URL veya DOM değişimini kabul eder. Href'siz butonlar için yalnız URL beklenmez.

Kanıt / doğrulama: tests/navigation-click.test.ts 7/7; npx tsc --noEmit -p . temiz (2026-11-06).

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-11-06T14:39:00+03:00", "evidence": "climbToClickableAncestor healing-page click yoluna bağlandı; self-heal.ts.", "id": "2026-11-06-clickable-div-text-fallback", "summary": "Metin locator tıklaması, JS-tıklanabilir üst elemana çıkarak kart/satır tıklamasını kurtarır.", "title": "getByText tıklamada tıklanabilir üste çıkış", "version": "1.9.0"} -->
## 1.9.0 — getByText tıklamada tıklanabilir üste çıkış

Metin locator tıklaması, JS-tıklanabilir üst elemana çıkarak kart/satır tıklamasını kurtarır.

Kanıt / doğrulama: climbToClickableAncestor healing-page click yoluna bağlandı; self-heal.ts.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-11-06T15:09:00+03:00", "evidence": "resolveCheckableOnPage healing-page check yoluna bağlandı.", "id": "2026-11-06-check-inner-checkbox", "summary": "check/uncheck başarısız olunca role/label/kapsayıcı içi sırayla işaretlenebilir eleman aranır.", "title": "CHECK locator heal kapsayıcı içi kutu", "version": "1.10.0"} -->
## 1.10.0 — CHECK locator heal kapsayıcı içi kutu

check/uncheck başarısız olunca role/label/kapsayıcı içi sırayla işaretlenebilir eleman aranır.

Kanıt / doğrulama: resolveCheckableOnPage healing-page check yoluna bağlandı.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-11-06T15:41:38+03:00", "evidence": "support/self-heal.ts resolveSelectOpenerOnPage + inferIntentLabel [id=] / from-field.", "id": "2026-11-06-dropdown-opener-id-near-label", "summary": "Açıcı locator bulunamazsa runner id/name/aria-labelledby/yakın etiket sırasıyla yeniden çözer; boşluklu id için [id=\"…\"] kullanılır.", "title": "Runner SELECT açıcı self-heal", "version": "1.11.0"} -->
## 1.11.0 — Runner SELECT açıcı self-heal

Açıcı locator bulunamazsa runner id/name/aria-labelledby/yakın etiket sırasıyla yeniden çözer; boşluklu id için [id="…"] kullanılır.

Kanıt / doğrulama: support/self-heal.ts resolveSelectOpenerOnPage + inferIntentLabel [id=] / from-field.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-11-06T15:57:49+03:00", "evidence": "support/healing-page.ts resolveScopedIconOnPage; support/self-heal.ts scoped icon helper.", "id": "2026-11-06-scoped-target-anchor-icon-identity", "summary": "Adım metnindeki in \"…\" + ikon kimliği locator bulamazsa kart/satır içinde yeniden çözülür; yanlış ürüne heal edilmez.", "title": "Koşuda kapsamlı ikon self-heal", "version": "1.12.0"} -->
## 1.12.0 — Koşuda kapsamlı ikon self-heal

Adım metnindeki in "…" + ikon kimliği locator bulamazsa kart/satır içinde yeniden çözülür; yanlış ürüne heal edilmez.

Kanıt / doğrulama: support/healing-page.ts resolveScopedIconOnPage; support/self-heal.ts scoped icon helper.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-06T16:45:56+03:00", "evidence": "BE scope-resolve cart-icon kimliği; healing-page resolveScopedIconOnPage (önceki görevle).", "id": "2026-11-06-scope-anchor-wait-select-opener", "summary": "SVG className (SVGAnimatedString) doğru okunur; cart-icon kimliği koşuda heal edilir.", "title": "Self-heal kapsamlı ikon (cart-icon sınıfı)", "version": "1.12.1"} -->
## 1.12.1 — Self-heal kapsamlı ikon (cart-icon sınıfı)

SVG className (SVGAnimatedString) doğru okunur; cart-icon kimliği koşuda heal edilir.

Kanıt / doğrulama: BE scope-resolve cart-icon kimliği; healing-page resolveScopedIconOnPage (önceki görevle).

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-11-06T17:34:28+03:00", "evidence": "self-heal.test.ts 9 passed", "id": "hitl-visual-pick-once", "summary": "Kilitli görsel seçimde self-heal yalnızca aynı kart ve aynı ikon kimliği içinde yeni locator kabul eder.", "title": "HITL one-shot visual element pick", "version": "1.13.0"} -->
## 1.13.0 — HITL one-shot visual element pick

Kilitli görsel seçimde self-heal yalnızca aynı kart ve aynı ikon kimliği içinde yeni locator kabul eder.

Kanıt / doğrulama: self-heal.test.ts 9 passed

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-06T22:24:59+03:00", "evidence": "tests/self-heal.test.ts 10 passed, including the card-title filter case.", "id": "hitl-screen-pick-card-scope", "summary": "Kilitli ekran seçimi filter({ has: getByText(...) }) biçimindeki kart başlığını da tanıyor. Onarım aynı başlık ve aynı ikon kimliğiyle kalıyor.", "title": "Visual pick heal keeps the card title filter", "version": "1.13.1"} -->
## 1.13.1 — Visual pick heal keeps the card title filter

Kilitli ekran seçimi filter({ has: getByText(...) }) biçimindeki kart başlığını da tanıyor. Onarım aynı başlık ve aynı ikon kimliğiyle kalıyor.

Kanıt / doğrulama: tests/self-heal.test.ts 10 passed, including the card-title filter case.

<!-- CHANGELOG:ENTRY {"bump": "minor", "date": "2026-11-07T03:22:52+03:00", "evidence": "healing-page.ts sıra ifadesini okur. Ayrı bir runner koşusu çalıştırılmadı.", "id": "list-item-ordinal", "summary": "Üretilen adım ilk, son veya n. öğeyi söylüyorsa self-heal aynı metnin o sıradaki eşleşmesini kullanır.", "title": "Koşuda liste sırasını koru", "version": "1.14.0"} -->
## 1.14.0 — Koşuda liste sırasını koru

Üretilen adım ilk, son veya n. öğeyi söylüyorsa self-heal aynı metnin o sıradaki eşleşmesini kullanır.

Kanıt / doğrulama: healing-page.ts sıra ifadesini okur. Ayrı bir runner koşusu çalıştırılmadı.

<!-- CHANGELOG:ENTRY {"bump": "patch", "date": "2026-11-08T19:03:44+03:00", "evidence": "tsc temiz. npm test 90/90 geçti; waitStepTimeoutMs(600000)=660000, NaN=180000, tavan WAIT_MAX_MS+60s. COTESTER_STEP_TIMEOUT_MS=2000 iken timeout:5000 olan 3 sn bekleme geçti, timeout'suz adım 2000 ms'de düştü.", "id": "wait-step-cucumber-timeout", "summary": "Uzun bekleme adımları, adımın kendi Cucumber süresini bekleme artı 60 saniye olarak hesaplar. Varsayılan 2 dakika sınırı diğer adımlar için durur.", "title": "Bekleme adımı Cucumber zaman aşımı", "version": "1.14.1"} -->
## 1.14.1 — Bekleme adımı Cucumber zaman aşımı

Uzun bekleme adımları, adımın kendi Cucumber süresini bekleme artı 60 saniye olarak hesaplar. Varsayılan 2 dakika sınırı diğer adımlar için durur.

Kanıt / doğrulama: tsc temiz. npm test 90/90 geçti; waitStepTimeoutMs(600000)=660000, NaN=180000, tavan WAIT_MAX_MS+60s. COTESTER_STEP_TIMEOUT_MS=2000 iken timeout:5000 olan 3 sn bekleme geçti, timeout'suz adım 2000 ms'de düştü.
