package com.automation.tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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

@ExtendWith(TestExecutionExtension.class)
public class DashboardTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private DashboardPage dashboardPage;
    private final TestConfig config = new TestConfig();

    public static class TestConfig {
        public String getBaseUrl() {
            return System.getenv("BASE_URL") != null ? System.getenv("BASE_URL") : "https://opensource-demo.orangehrmlive.com/index.php/dashboard";
        }

        public long getExplicitTimeoutSeconds() {
            return 10;
        }
    }

    public static class TestExecutionExtension implements org.junit.jupiter.api.extension.Extension {
        // JUnit 5 Extension boilerplate for test lifecycle monitoring if needed
    }

    public static class DashboardPage {
        private final WebDriver driver;
        private final WebDriverWait wait;

        @FindBy(xpath = "//li[8]/a/b")
        private WebElement dashboardTextLocator;

        @FindBy(id = "welcome")
        private WebElement welcomeMessage;

        @FindBy(linkText = "Logout")
        private WebElement logoutMenu;

        public DashboardPage(WebDriver driver, WebDriverWait wait) {
            this.driver = driver;
            this.wait = wait;
            PageFactory.initElements(driver, this);
        }

        public void clickWelcomeMessage() {
            wait.until(ExpectedConditions.elementToBeClickable(welcomeMessage)).click();
        }

        public void clickLogout() {
            wait.until(ExpectedConditions.elementToBeClickable(logoutMenu)).click();
        }

        public String getDashboardText() {
            return wait.until(ExpectedConditions.visibilityOf(dashboardTextLocator)).getText();
        }
    }

    @BeforeEach
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(config.getExplicitTimeoutSeconds()));
        driver.get(config.getBaseUrl());
        dashboardPage = new DashboardPage(driver, wait);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("Verify dashboard text is correctly displayed")
    public void testVerifyDashboardText() {
        String dashboardText = dashboardPage.getDashboardText();
        assertTrue(dashboardText != null && !dashboardText.isEmpty(), "Dashboard text should be present and non-empty.");
    }

    @Test
    @DisplayName("Verify user can successfully logout from the dashboard")
    public void testUserLogoutWorkflow() {
        dashboardPage.clickWelcomeMessage();
        dashboardPage.clickLogout();
        
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("login") || currentUrl.contains("auth"), 
            "User should be redirected to the login page after logging out. Current URL: " + currentUrl);
    }
}

