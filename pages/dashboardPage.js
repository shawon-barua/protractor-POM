
var Dashboardpage = function() {
    var dashboadText = element(by.xpath('//li[8]/a/b'));
    var wlcmMsg = element(by.id('welcome'));
    var menuLogout = element(by.linkText('Logout'));
    var until = protractor.ExpectedConditions;

    
    this.clickWelcomeMsg = function() {
      wlcmMsg.click();
    }
  
    this.clickLogout = function() {
      browser.wait(until.presenceOf(menuLogout), 5000, 'Element taking too long to appear in the DOM');

      menuLogout.click();
    }

      this.getDashboardText = function() {
        return dashboadText.getText();
      };
  };
  module.exports = new Dashboardpage();