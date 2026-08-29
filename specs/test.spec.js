const { browser, element, by, protractor } = require('protractor');
const EC = protractor.ExpectedConditions;

const config = {
    baseUrl: process.env.ORANGE_HRM_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    validUsername: process.env.ORANGE_HRM_USER || 'Admin',
    validPassword: process.env.ORANGE_HRM_PASS || 'admin123',
    timeout: 10000
};

class LoginPage {
    constructor() {
        this.usernameField = element(by.name('username'));
        this.passwordField = element(by.name('password'));
        this.loginButton = element(by.css("button[type='submit']"));
        this.invalidCredentialsMessage = element(by.css('.oxd-alert-content-text'));
        this.loginPanelTitle = element(by.css('.orangehrm-login-title'));
    }

    async setUserName(username) {
        await browser.wait(EC.visibilityOf(this.usernameField), config.timeout);
        await this.usernameField.clear();
        await this.usernameField.sendKeys(username);
    }

    async setUserPass(password) {
        await browser.wait(EC.visibilityOf(this.passwordField), config.timeout);
        await this.passwordField.clear();
        await this.passwordField.sendKeys(password);
    }

    async clickLogin() {
        await browser.wait(EC.elementToBeClickable(this.loginButton), config.timeout);
        await this.loginButton.click();
    }

    async getInvalidMsg() {
        await browser.wait(EC.visibilityOf(this.invalidCredentialsMessage), config.timeout);
        return await this.invalidCredentialsMessage.getText();
    }

    async getLoginPageText() {
        await browser.wait(EC.visibilityOf(this.loginPanelTitle), config.timeout);
        return await this.loginPanelTitle.getText();
    }
}

class DashboardPage {
    constructor() {
        this.dashboardHeaderTitle = element(by.css('.oxd-topbar-header-breadcrumb-module'));
        this.userDropdownMenu = element(by.css('.oxd-userdropdown-tab'));
        this.logoutLink = element(by.css("a[href*='logout']"));
    }

    async getDashboardText() {
        await browser.wait(EC.visibilityOf(this.dashboardHeaderTitle), config.timeout);
        return await this.dashboardHeaderTitle.getText();
    }

    async clickWelcomeMsg() {
        await browser.wait(EC.elementToBeClickable(this.userDropdownMenu), config.timeout);
        await this.userDropdownMenu.click();
    }

    async clickLogout() {
        await browser.wait(EC.elementToBeClickable(this.logoutLink), config.timeout);
        await this.logoutLink.click();
    }
}

const loginPage = new LoginPage();
const dashboardPage = new DashboardPage();

describe('OrangeHRM Login Tests', () => {
    beforeEach(async () => {
        await browser.waitForAngularEnabled(false);
        await browser.manage().window().maximize();
        await browser.get(config.baseUrl);
    });

    afterEach(async () => {
        await browser.waitForAngularEnabled(true);
    });

    it('verifyErrorMessageForInvalidCredentials', async () => {
        await loginPage.setUserName('Admin1');
        await loginPage.setUserPass('admin1231');
        await loginPage.clickLogin();

        const actualErrorMsg = await loginPage.getInvalidMsg();
        expect(actualErrorMsg).toEqual('Invalid credentials');
    });

    it('verifyUserSuccessfullyLoggedIn', async () => {
        await loginPage.setUserName(config.validUsername);
        await loginPage.setUserPass(config.validPassword);
        await loginPage.clickLogin();

        const actualDashboardText = await dashboardPage.getDashboardText();
        expect(actualDashboardText).toEqual('Dashboard');
    });

    it('verifyUserSuccessfullyLoggedOut', async () => {
        await loginPage.setUserName(config.validUsername);
        await loginPage.setUserPass(config.validPassword);
        await loginPage.clickLogin();

        await dashboardPage.clickWelcomeMsg();
        await dashboardPage.clickLogout();

        const actualLoginPanelText = await loginPage.getLoginPageText();
        expect(actualLoginPanelText).toEqual('Login');
    });
});