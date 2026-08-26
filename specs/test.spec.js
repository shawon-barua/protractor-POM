import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(TestResultLoggerExtension.class)
public class OrangeHrmLoginTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private LoginPage loginPage;
    private DashboardPage dashboardPage;

    private static final String BASE_URL = System.getenv("ORANGE_HRM_URL") != null 
            ? System.getenv("ORANGE_HRM_URL") 
            : "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
    
    private static final String VALID_USERNAME = System.getenv("ORANGE_HRM_USER") != null 
            ? System.getenv("ORANGE_HRM_USER") 
            : "Admin";
            
    private static final String VALID_PASSWORD = System.getenv("ORANGE_HRM_PASS") != null 
            ? System.getenv("ORANGE_HRM_PASS") 
            : "admin123";

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        loginPage = new LoginPage(driver, wait);
        dashboardPage = new DashboardPage(driver, wait);

        driver.get(BASE_URL);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void verifyErrorMessageForInvalidCredentials() {
        loginPage.setUserName("Admin1");
        loginPage.setUserPass("admin1231");
        loginPage.clickLogin();

        String actualErrorMsg = loginPage.getInvalidMsg();
        assertEquals("Invalid credentials", actualErrorMsg, "The invalid credentials error message did not match expectations.");
    }

    @Test
    public void verifyUserSuccessfullyLoggedIn() {
        loginPage.setUserName(VALID_USERNAME);
        loginPage.setUserPass(VALID_PASSWORD);
        loginPage.clickLogin();

        String actualDashboardText = dashboardPage.getDashboardText();
        assertEquals("Dashboard", actualDashboardText, "The user was not redirected to the dashboard page.");
    }

    @Test
    public void verifyUserSuccessfullyLoggedOut() {
        // First log in to reach the dashboard
        loginPage.setUserName(VALID_USERNAME);
        loginPage.setUserPass(VALID_PASSWORD);
        loginPage.clickLogin();

        dashboardPage.clickWelcomeMsg();
        dashboardPage.clickLogout();

        String actualLoginPanelText = loginPage.getLoginPageText();
        assertEquals("Login", actualLoginPanelText, "The user was not successfully logged out back to the login panel.");
    }

    public static class LoginPage {
        private final WebDriver driver;
        private final WebDriverWait wait;

        @FindBy(name = "username")
        private WebElement usernameField;

        @FindBy(name = "password")
        private WebElement passwordField;

        @FindBy(css = "button[type='submit']")
        private WebElement loginButton;

        @FindBy(css = ".oxd-alert-content-text")
        private WebElement invalidCredentialsMessage;

        @FindBy(css = ".orangehrm-login-title")
        private WebElement loginPanelTitle;

        public LoginPage(WebDriver driver, WebDriverWait wait) {
            this.driver = driver;
            this.wait = wait;
            PageFactory.initElements(driver, this);
        }

        public void setUserName(String username) {
            wait.until(ExpectedConditions.visibilityOf(usernameField));
            usernameField.clear();
            usernameField.sendKeys(username);
        }

        public void setUserPass(String password) {
            wait.until(ExpectedConditions.visibilityOf(passwordField));
            passwordField.clear();
            passwordField.sendKeys(password);
        }

        public void clickLogin() {
            wait.until(ExpectedConditions.elementToBeClickable(loginButton));
            loginButton.click();
        }

        public String getInvalidMsg() {
            wait.until(ExpectedConditions.visibilityOf(invalidCredentialsMessage));
            return invalidCredentialsMessage.getText();
        }

        public String getLoginPageText() {
            wait.until(ExpectedConditions.visibilityOf(loginPanelTitle));
            return loginPanelTitle.getText();
        }
    }

    public static class DashboardPage {
        private final WebDriver driver;
        private final WebDriverWait wait;

        @FindBy(css = ".oxd-topbar-header-breadcrumb-module")
        private WebElement dashboardHeaderTitle;

        @FindBy(css = ".oxd-userdropdown-tab")
        private WebElement userDropdownMenu;

        @FindBy(xpath = "//a[text()='Logout']")
        private WebElement logoutLink;

        public DashboardPage(WebDriver driver, WebDriverWait wait) {
            this.driver = driver;
            this.wait = wait;
            PageFactory.initElements(driver, this);
        }

        public String getDashboardText() {
            wait.until(ExpectedConditions.visibilityOf(dashboardHeaderTitle));
            return dashboardHeaderTitle.getText();
        }

        public void clickWelcomeMsg() {
            wait.until(ExpectedConditions.elementToBeClickable(userDropdownMenu));
            userDropdownMenu.click();
        }

        public void clickLogout() {
            wait.until(ExpectedConditions.elementToBeClickable(logoutLink));
            logoutLink.click();
        }
    }
}

class TestResultLoggerExtension implements org.junit.jupiter.api.extension.TestWatcher {
    @Override
    public void testSuccessful(org.junit.jupiter.api.extension.ExtensionContext context) {
        // Hook for test success logging if needed
    }

    @Override
    public void testFailed(org.junit.jupiter.api.extension.ExtensionContext context, Throwable cause) {
        // Hook for test failure logging if needed
    }
}