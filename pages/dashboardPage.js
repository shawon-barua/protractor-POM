/**
 * Test Configuration for environment-aware parameters.
 * Addresses hard-coded test data by falling back to environment variables or safe defaults.
 */
class TestConfig {
    getBaseUrl() {
        return process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/index.php/dashboard';
    }

    getExplicitTimeout() {
        return 10000;
    }
}

const config = new TestConfig();
const EC = protractor.ExpectedConditions;

/**
 * Page Object Class for the Dashboard Page.
 * Encapsulates all locators and actions using Protractor best practices.
 */
class DashboardPage {
    constructor() {
        this.dashboardTextLocator = element(by.xpath('//li[8]/a/b'));
        this.welcomeMessage = element(by.id('welcome'));
        this.logoutMenu = element(by.linkText('Logout'));
    }

    async clickWelcomeMessage() {
        await browser.wait(EC.elementToBeClickable(this.welcomeMessage), config.getExplicitTimeout());
        await this.welcomeMessage.click();
    }

    async clickLogout() {
        await browser.wait(EC.elementToBeClickable(this.logoutMenu), config.getExplicitTimeout());
        await this.logoutMenu.click();
    }

    async getDashboardText() {
        await browser.wait(EC.visibilityOf(this.dashboardTextLocator), config.getExplicitTimeout());
        return await this.dashboardTextLocator.getText();
    }
}

module.exports = new DashboardPage();

describe('DashboardTest', () => {
    let dashboardPage;

    beforeEach(async () => {
        dashboardPage = require('./dashboard.po'); // Assuming page object is required or globally available
        
        // Disable Angular synchronization if testing a non-Angular or hybrid page
        await browser.waitForAngularEnabled(false);
        await browser.manage().window().maximize();
        await browser.get(config.getBaseUrl());
    });

    afterEach(async () => {
        // Restore Angular synchronization to default state after test execution
        await browser.waitForAngularEnabled(true);
    });

    it('Verify dashboard text is correctly displayed', async () => {
        const dashboardText = await dashboardPage.getDashboardText();
        expect(dashboardText).toBeTruthy();
        expect(dashboardText.length).toBeGreaterThan(0);
    });

    it('Verify user can successfully logout from the dashboard', async () => {
        await dashboardPage.clickWelcomeMessage();
        await dashboardPage.clickLogout();

        const currentUrl = await browser.getCurrentUrl();
        const isLoggedOut = currentUrl.includes('login') || currentUrl.includes('auth');
        expect(isLoggedOut).toBe(true);
    });
});
