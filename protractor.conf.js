package com.example.tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

class TestConfig {
    public static final String BASE_URL = System.getenv("TEST_BASE_URL") != null 
        ? System.getenv("TEST_BASE_URL") 
        : "https://example.com/login";
    public static final int TIMEOUT_SECONDS = 10;
}

class ScreenshotExtension implements TestWatcher {
    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        // Production-ready hook for capturing failure screenshots if needed
    }
}

class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(id = "username")
    private WebElement usernameInput;

    @FindBy(id = "password")
    private WebElement passwordInput;

    @FindBy(id = "loginBtn")
    private WebElement loginButton;

    @FindBy(id = "successMessage")
    private WebElement successMessage;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(TestConfig.TIMEOUT_SECONDS));
        PageFactory.initElements(driver, this);
    }

    public void navigateTo() {
        driver.get(TestConfig.BASE_URL);
    }

    public void enterUsername(String username) {
        wait.until(ExpectedConditions.visibilityOf(usernameInput)).clear();
        usernameInput.sendKeys(username);
    }

    public void enterPassword(String password) {
        wait.until(ExpectedConditions.visibilityOf(passwordInput)).clear();
        passwordInput.sendKeys(password);
    }

    public void clickLoginButton() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
    }

    public boolean isSuccessMessageDisplayed() {
        return wait.until(ExpectedConditions.visibilityOf(successMessage)).isDisplayed();
    }
}

@ExtendWith(ScreenshotExtension.class)
public class LoginSpecTest {

    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("start-maximized");
        driver = new ChromeDriver(options);
        loginPage = new LoginPage(driver);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testSuccessfulUserLogin() {
        String validUsername = System.getenv("TEST_USERNAME") != null ? System.getenv("TEST_USERNAME") : "standard_user";
        String validPassword = System.getenv("TEST_PASSWORD") != null ? System.getenv("TEST_PASSWORD") : "secret_password";

        loginPage.navigateTo();
        loginPage.enterUsername(validUsername);
        loginPage.enterPassword(validPassword);
        loginPage.clickLoginButton();

        boolean isLoginSuccessful = loginPage.isSuccessMessageDisplayed();
        assertTrue(isLoginSuccessful, "The success message should be displayed after entering valid credentials.");
    }
}

