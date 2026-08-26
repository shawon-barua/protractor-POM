package com.example.tests;

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
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(TestResultWatcher.class)
public class OrangeHrmLoginTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private LoginPage loginPage;

    private static final String BASE_URL = System.getenv("APP_URL") != null 
            ? System.getenv("APP_URL") 
            : "https://opensource-demo.orangehrmlive.com/";

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        loginPage = new LoginPage(driver, wait);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testLoginPanelHeadingIsDisplayed() {
        loginPage.navigateToLoginPage(BASE_URL);
        String panelHeading = loginPage.getLoginPageText();
        assertTrue(panelHeading.contains("LOGIN Panel"), 
                "The login panel heading should be visible and contain expected text.");
    }

    @Test
    public void testInvalidLoginShowsErrorMessage() {
        loginPage.navigateToLoginPage(BASE_URL);
        loginPage.setUserName("InvalidUser");
        loginPage.setUserPass("WrongPassword");
        loginPage.clickLogin();

        String errorMessage = loginPage.getInvalidMsg();
        assertEquals("Invalid credentials", errorMessage, 
                "An invalid login attempt should display the correct error message.");
    }

    public static class LoginPage {
        private final WebDriver driver;
        private final WebDriverWait wait;

        @FindBy(id = "txtUsername")
        private WebElement nameInput;

        @FindBy(id = "txtPassword")
        private WebElement passInput;

        @FindBy(id = "btnLogin")
        private WebElement btnLogin;

        @FindBy(id = "logInPanelHeading")
        private WebElement loginPanelText;

        @FindBy(id = "spanMessage")
        private WebElement loginPanelInvalidMsg;

        public LoginPage(WebDriver driver, WebDriverWait wait) {
            this.driver = driver;
            this.wait = wait;
            PageFactory.initElements(driver, this);
        }

        public void navigateToLoginPage(String url) {
            driver.get(url);
            wait.until(ExpectedConditions.visibilityOf(loginPanelText));
        }

        public void setUserName(String name) {
            wait.until(ExpectedConditions.visibilityOf(nameInput));
            nameInput.clear();
            nameInput.sendKeys(name);
        }

        public void setUserPass(String pass) {
            wait.until(ExpectedConditions.visibilityOf(passInput));
            passInput.clear();
            passInput.sendKeys(pass);
        }

        public void clickLogin() {
            wait.until(ExpectedConditions.elementToBeClickable(btnLogin));
            btnLogin.click();
        }

        public String getLoginPageText() {
            wait.until(ExpectedConditions.visibilityOf(loginPanelText));
            return loginPanelText.getText();
        }

        public String getInvalidMsg() {
            wait.until(ExpectedConditions.visibilityOf(loginPanelInvalidMsg));
            return loginPanelInvalidMsg.getText();
        }
    }
}

