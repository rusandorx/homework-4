module.exports = {
  gridUrl: 'http://localhost:4444/wd/hub',
  takeScreenshotOnFailsTimeout: 20000,

  windowSize: '1920x1080',
  browsers: {
    chrome: {
      automationProtocol: 'webdriver',

      desiredCapabilities: {
        browserName: 'chrome'
      },
      headless: true,
    },
    edge: {
      automationProtocol: 'webdriver',

      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      }
    }
  },
  plugins: {
    'html-reporter/hermione': {
      path: 'hermione-html-report'
    }
  }
}
