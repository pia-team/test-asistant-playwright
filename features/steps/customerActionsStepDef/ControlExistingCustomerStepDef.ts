import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../../pages/logInPage/login.page';
import { ControlExistingCustomerPage } from '../../../pages/customerActionsPage/ControlExistingCustomerPage';
import { ICustomWorld } from '../../../support/world';







When('User clicks the searching type dropdown',async function (this: ICustomWorld) {
  const controlExistingCutomerPage = new ControlExistingCustomerPage(this.page!);
  await controlExistingCutomerPage.clikingTypeOfsearchingDrop()
})

When('User selects the {string} option from dropdown', async function (this: ICustomWorld,type:string) {
  const controlExistingCutomerPage = new ControlExistingCustomerPage(this.page!);
  await controlExistingCutomerPage.selectingTheTypeOfsearcing(type)
})

When('User enters the name as {string} intoinput field', async function (this: ICustomWorld,value:string){
  const controlExistingCutomerPage = new ControlExistingCustomerPage(this.page!);
 await  controlExistingCutomerPage.enteringValueIntoFiel(value)
})
When('User  clicks the search icon', async function (this: ICustomWorld) {
  const controlExistingCutomerPage = new ControlExistingCustomerPage(this.page!);
 await controlExistingCutomerPage.clickingsearchingIcon()
})

When('User clicks the option from the list', async function (this: ICustomWorld){
  const controlExistingCutomerPage = new ControlExistingCustomerPage(this.page!);
  await controlExistingCutomerPage.selectingOptionFromFilter()
})

When('User clicks the logout dropdown button', async function (this: ICustomWorld) {
     const controlExistingCutomerPage = new ControlExistingCustomerPage(this.page!);
    await controlExistingCutomerPage.clickingLogoutDropdown()
})

When('User logs out from main page', async function (this: ICustomWorld) {
  const controlExistingCutomerPage = new ControlExistingCustomerPage(this.page!);
  await controlExistingCutomerPage.clickingLogoutOption()
})
When('User enters username as {string}',async function (this: ICustomWorld,username:string) {
  const controlExistingCutomerPage = new ControlExistingCustomerPage(this.page!);
  await controlExistingCutomerPage.enterUsername(username)
})
When('User enters password  {string}', async function (this: ICustomWorld,passsword:string) {
  const controlExistingCutomerPage = new ControlExistingCustomerPage(this.page!);
 await controlExistingCutomerPage.enterPassword(passsword)
})




