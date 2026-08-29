const { browser, element, by, protractor } = require('protractor');

const TestConfig = {
    BASE_URL: process.env.TEST_BASE_URL || 'https://example.com/login',
    TIMEOUT_MS: 10000,
    VALID_USERNAME: process.env.TEST_USERNAME || 'standard_user',
    VALID_PASSWORD: process.env.TEST_PASSWORD || 'secret_password'
};

class LoginPage {
    constructor() {
        this.usernameInput = element(by.model('username'));
        this.passwordInput = element(by.model('password'));
        this.loginButton = element(by.buttonText('Login'));
        this.successMessage = element(by.binding('successMessage'));
        this.EC = protractor.ExpectedConditions;
    }

    async navigateTo() {
        await browser.get(TestConfig.BASE_URL);
    }

    async enterUsername(username) {
        await browser.wait(this.EC.visibilityOf(this.usernameInput), TestConfig.TIMEOUT_MS);
        await this.usernameInput.clear();
        await this.usernameInput.sendKeys(username);
    }

    async enterPassword(password) {
        await browser.wait(this.EC.visibilityOf(this.passwordInput), TestConfig.TIMEOUT_MS);
        await this.passwordInput.clear();
        await this.passwordInput.sendKeys(password);
    }

    async clickLoginButton() {
        await browser.wait(this.EC.elementToBeClickable(this.loginButton), TestConfig.TIMEOUT_MS);
        await this.loginButton.click();
    }

    async isSuccessMessageDisplayed() {
        await browser.wait(this.EC.visibilityOf(this.successMessage), TestConfig.TIMEOUT_MS);
        return await this.successMessage.isDisplayed();
    }
}

const loginPage = new LoginPage();

describe('LoginSpecTest', () => {
    beforeEach(async () => {
        await browser.waitForAngularEnabled(true);
    });

    afterEach(async () => {
        await browser.waitForAngularEnabled(true);
    });

    it('should successfully login user', async () => {
        await loginPage.navigateTo();
        await loginPage.enterUsername(TestConfig.VALID_USERNAME);
        await loginPage.enterPassword(TestConfig.VALID_PASSWORD);
        await loginPage.clickLoginButton();

        const isLoginSuccessful = await loginPage.isSuccessMessageDisplayed();
        expect(isLoginSuccessful).toBe(true);
    });
});
