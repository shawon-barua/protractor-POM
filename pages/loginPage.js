var Logipage = function() {
    var nameInput = element(by.id('txtUsername'));
    var passInput = element(by.id('txtPassword'));
    var btnLogin = element(by.id('btnLogin'));
    var loginPanelText = element(by.id('logInPanelHeading'));
    var loginPanelinvalidMsg = element(by.id('spanMessage'));

    this.get = function() {
      browser.waitForAngularEnabled(false);

      browser.get('https://opensource-demo.orangehrmlive.com/');
    };
  
    this.setUserName = function(name) {
      nameInput.sendKeys(name);
    };
  
    this.setUserPass = function(pass) {
        passInput.sendKeys(pass);
      };

    this.clickLogin = function() {
      btnLogin.click();
    }

    this.getLoginPageText = function() {
      return loginPanelText.getText();
    };

    this.getInvalidMsg = function() {
      return loginPanelinvalidMsg.getText();
    };
  };
  module.exports = new Logipage();