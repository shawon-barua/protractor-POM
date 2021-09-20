var dashboardPage = require('../pages/dashboardPage');
var loginPage = require('../pages/loginPage');

describe('OrangeHRM site check', function() {
  it('login-0001-error message for invalid credintials', function() {
    loginPage.get();

    loginPage.setUserName('Admin1');
    loginPage.setUserPass('admin1231');
    loginPage.clickLogin();

    expect(loginPage.getInvalidMsg()).toEqual('Invalid credentials');
  });
  it('login-0001-user should able to login', function() {
    loginPage.get();

    loginPage.setUserName('Admin');
    loginPage.setUserPass('admin123');
    loginPage.clickLogin();

    expect(dashboardPage.getDashboardText()).toEqual('Dashboard');
  });

  it('login-0003-user should be able to logout', function() {
    dashboardPage.clickWelcomeMsg();
    dashboardPage.clickLogout();

    expect(loginPage.getLoginPageText()).toEqual('LOGIN Panel');
  });
});