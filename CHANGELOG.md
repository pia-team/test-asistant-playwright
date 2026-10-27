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
