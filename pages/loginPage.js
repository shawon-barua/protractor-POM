const { browser, element, by, protractor } = require('protractor');

class LoginPage {
    constructor() {
        this.nameInput = element(by.model('username'));
        this.passInput = element(by.model('password'));
        this.btnLogin = element(by.buttonText('Login'));
        this.loginPanelText = element(by.binding('loginPanelHeading'));
        this.loginPanelInvalidMsg = element(by.binding('spanMessage'));
    }

    async navigateToLoginPage(url) {
        await browser.get(url);
        const EC = protractor.ExpectedConditions;
        await browser.wait(EC.visibilityOf(this.loginPanelText), 10000);
    }

    async setUserName(name) {
        const EC = protractor.ExpectedConditions;
        await browser.wait(EC.visibilityOf(this.nameInput), 10000);
        await this.nameInput.clear();
        await this.nameInput.sendKeys(name);
    }

    async setUserPass(pass) {
        const EC = protractor.ExpectedConditions;
        await browser.wait(EC.visibilityOf(this.passInput), 10000);
        await this.passInput.clear();
        await this.passInput.sendKeys(pass);
    }

    async clickLogin() {
        const EC = protractor.ExpectedConditions;
        await browser.wait(EC.elementToBeClickable(this.btnLogin), 10000);
        await this.btnLogin.click();
    }

    async getLoginPageText() {
        const EC = protractor.ExpectedConditions;
        await browser.wait(EC.visibilityOf(this.loginPanelText), 10000);
        return await this.loginPanelText.getText();
    }

    async getInvalidMsg() {
        const EC = protractor.ExpectedConditions;
        await browser.wait(EC.visibilityOf(this.loginPanelInvalidMsg), 10000);
        return await this.loginPanelInvalidMsg.getText();
    }
}

const loginPage = new LoginPage();

describe('OrangeHRM Login Test', () => {
    const BASE_URL = process.env.APP_URL || 'https://opensource-demo.orangehrmlive.com/';

    beforeEach(async () => {
        await browser.waitForAngularEnabled(true);
        await browser.manage().window().maximize();
    });

    afterEach(async () => {
        await browser.waitForAngularEnabled(true);
    });

    it('testLoginPanelHeadingIsDisplayed', async () => {
        await loginPage.navigateToLoginPage(BASE_URL);
        const panelHeading = await loginPage.getLoginPageText();
        expect(panelHeading).toContain('LOGIN Panel');
    });

    it('testInvalidLoginShowsErrorMessage', async () => {
        await loginPage.navigateToLoginPage(BASE_URL);
        await loginPage.setUserName('InvalidUser');
        await loginPage.setUserPass('WrongPassword');
        await loginPage.clickLogin();

        const errorMessage = await loginPage.getInvalidMsg();
        expect(errorMessage).toEqual('Invalid credentials');
    });
});
