import { Page, Locator } from '@playwright/test';

export class ChargingActivation3102Page {
  readonly page: Page;

  // Sign In Page Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signInHeader: Locator;

  // Customer360 Page Locators
  readonly customer360SearchTypeDropdown: Locator;
  readonly customerIdOption: Locator;
  readonly customer360SearchBar: Locator;
  readonly customer360SearchButton: Locator;
  readonly customer360SearchResult: Locator;
  readonly accountTab: Locator;
  readonly orderTab: Locator;
  readonly shoppingCartTab: Locator;
  readonly orderStatusField: Locator;
  readonly shoppingCartStatusField: Locator;
  readonly goToCustomer360Button: Locator;

  // Customer Order Page Locators
  readonly newOrderButton: Locator;
  readonly salesAgentNameField: Locator;
  readonly externalOrderIdField: Locator;
  readonly crmCaseIdField: Locator;
  readonly salesAgentChannelField: Locator;
  readonly continueButton: Locator;

  // Catalog Page Locators
  readonly saasCategory: Locator;
  readonly vodafoneHintsSubCategory: Locator;
  readonly catalogSearchButton: Locator;
  readonly productList: Locator;
  readonly vodafoneHintsBasicProduct: Locator;

  // Product Offering Page Locators
  readonly vodafoneHintsBasicOffering: Locator;
  readonly vodafoneHintsServiceType: Locator;
  readonly vodafoneHintsBasicProductDisplay: Locator;
  readonly optiuneHintsExtraUserProduct: Locator;
  readonly invoicingFrequencyDropdown: Locator;
  readonly monthlyOption: Locator;
  readonly yearlyOption: Locator;
  readonly oneTimeOption: Locator;
  readonly priceSelector: Locator;
  readonly cartIcon: Locator;
  readonly addToCartButton: Locator;
  readonly productDetailsTable: Locator;
  readonly addonProductIcon: Locator;
  readonly quantityIncrementButton: Locator;
  readonly addonDecisionToggle: Locator;
  readonly totalPriceDisplay: Locator;
  readonly leftPanelData: Locator;

  // Shopping Cart Page Locators
  readonly shoppingCartPage: Locator;
  readonly checkoutButton: Locator;
  readonly successMessage: Locator;

  // BackOffice Page Locators
  readonly backOfficeHome: Locator;
  readonly logoutButton: Locator;
  readonly moreVertIcon: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sign In Page
    this.usernameInput = page.getByRole('textbox', { name: /username|email/i });
    this.passwordInput = page.getByLabel(/password/i);
    this.signInButton = page.getByRole('button', { name: /sign in|login/i });
    this.signInHeader = page.getByRole('heading', { name: /sign in to your account/i });

    // Customer360 Page
    this.customer360SearchTypeDropdown = page.getByRole('combobox', { name: /search type/i });
    this.customerIdOption = page.getByRole('option', { name: /customer id/i });
    this.customer360SearchBar = page.getByRole('textbox', { name: /search/i });
    this.customer360SearchButton = page.getByRole('button', { name: /search/i });
    this.customer360SearchResult = page.getByRole('link', { name: /C85891386G/i });
    this.accountTab = page.getByRole('tab', { name: /account/i });
    this.orderTab = page.getByRole('tab', { name: /order/i });
    this.shoppingCartTab = page.getByRole('tab', { name: /shopping cart/i });
    this.orderStatusField = page.getByText(/INPROGRESS/i);
    this.shoppingCartStatusField = page.getByText(/COMPLETED/i);
    this.goToCustomer360Button = page.getByRole('button', { name: /go back|customer360/i });

    // Customer Order Page
    this.newOrderButton = page.getByRole('button', { name: /new order/i });
    this.salesAgentNameField = page.getByLabel(/sales agent name/i);
    this.externalOrderIdField = page.getByLabel(/external order id/i);
    this.crmCaseIdField = page.getByLabel(/crm case id/i);
    this.salesAgentChannelField = page.getByLabel(/sales agent channel/i);
    this.continueButton = page.getByRole('button', { name: /continue/i });

    // Catalog Page
    this.saasCategory = page.getByRole('button', { name: /saas/i });
    this.vodafoneHintsSubCategory = page.getByRole('button', { name: /vodafone hints/i });
    this.catalogSearchButton = page.getByRole('button', { name: /search/i });
    this.productList = page.getByRole('list');
    this.vodafoneHintsBasicProduct = page.getByText(/Vodafone Hints Basic/i);

    // Product Offering Page
    this.vodafoneHintsBasicOffering = page.getByText(/Vodafone Hints Basic/i).first();
    this.vodafoneHintsServiceType = page.getByText(/Vodafone Hints/i);
    this.vodafoneHintsBasicProductDisplay = page.getByText(/Vodafone Hints Basic/i);
    this.optiuneHintsExtraUserProduct = page.getByText(/Optiune Hints extra user/i);
    this.invoicingFrequencyDropdown = page.getByRole('combobox', { name: /invoicing frequency/i });
    this.monthlyOption = page.getByRole('option', { name: /monthly/i });
    this.yearlyOption = page.getByRole('option', { name: /yearly/i });
    this.oneTimeOption = page.getByRole('option', { name: /one time/i });
    this.priceSelector = page.getByRole('radio', { name: /price/i });
    this.cartIcon = page.getByRole('button', { name: /cart|add to cart/i });
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.productDetailsTable = page.getByRole('table');
    this.addonProductIcon = page.getByRole('button', { name: /add|pachet lunar/i });
    this.quantityIncrementButton = page.getByRole('button', { name: /increment|\+/i });
    this.addonDecisionToggle = page.getByRole('switch', { name: /add addon/i });
    this.totalPriceDisplay = page.getByText(/total price/i);
    this.leftPanelData = page.getByRole('region', { name: /product details/i });

    // Shopping Cart Page
    this.shoppingCartPage = page.getByText(/shopping cart/i);
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
    this.successMessage = page.getByText(/successfully submitted/i);

    // BackOffice Page
    this.backOfficeHome = page.getByText(/backoffice/i);
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    this.moreVertIcon = page.getByRole('button', { name: /more_vert/i });
  }
}