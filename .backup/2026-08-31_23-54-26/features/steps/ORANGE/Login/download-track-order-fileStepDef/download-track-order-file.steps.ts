import { Given, When, Then } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { getEnvConfig } from '../../../../../support/env';
import { DownloadTrackOrderFilePage } from '../../../../../pages/ORANGE/Login/download-track-order-filePage/download-track-order-file.page';

Given('the user is on the login page for download-track-order-file', async function (this: ICustomWorld) {
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.navigateToLogin();
});

When('the user clicks the "Login" button for download-track-order-file', async function (this: ICustomWorld) {
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.clickLoginSubmitButton();
});

When('the user clicks the "Username or email" textbox for download-track-order-file', async function (this: ICustomWorld) {
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.clickUsernameField();
});

When('the user enters the username into the "Username or email" textbox for download-track-order-file', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.username) {
    throw new Error('username not configured in environment profile');
  }
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.fillUsername(env.username);
});

When('the user clicks the "Password" textbox for download-track-order-file', async function (this: ICustomWorld) {
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.clickPasswordField();
});

When('the user enters the password into the "Password" textbox for download-track-order-file', async function (this: ICustomWorld) {
  const env = getEnvConfig();
  if (!env.password) {
    throw new Error('password not configured in environment profile');
  }
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.fillPassword(env.password);
});

When('the user clicks the "Sign In" button for download-track-order-file', async function (this: ICustomWorld) {
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.clickSignInButton();
});

When('the user clicks the "Track Orders" sidebar item for download-track-order-file', async function (this: ICustomWorld) {
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.clickTrackOrdersSidebarItem();
});

When('the user clicks the {string} order link for download-track-order-file', async function (this: ICustomWorld, orderId: string) {
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.clickOrderLink(orderId);
});

Then('the user clicks the "Download" button for download-track-order-file', async function (this: ICustomWorld) {
  const page = new DownloadTrackOrderFilePage(this.page!);
  await page.clickDownloadButton();
});