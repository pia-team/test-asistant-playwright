import { When } from '@cucumber/cucumber';
import type { ICustomWorld } from '../../../../../support/world';
import { FileUploadPage } from '../../../../../pages/Practice/Upload/file-uploadPage/file-upload.page';

When('I click the " Contact us" link for file-upload', async function (this: ICustomWorld) {
  const page = new FileUploadPage(this.page!);
  await page.clickContactUsLink();
});

When('I click the "Choose File" button for file-upload', async function (this: ICustomWorld) {
  const page = new FileUploadPage(this.page!);
  await page.clickChooseFileButton();
});

When('I upload the file "sample.pdf" for file-upload', async function (this: ICustomWorld) {
  const page = new FileUploadPage(this.page!);
  await page.uploadFile('sample');
});