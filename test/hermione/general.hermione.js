const { assert } = require('chai');

beforeEach(async function() {
  await this.browser.url('http://localhost:8000/hw/store');
});

describe('Тесты для всей страницы: ', function () {
  it('Страница должна адаптироваться под ширину экрана', async function () {
    const BIG_X = 1920, BIG_Y = 1080;
    const SMALL_X = 640, SMALL_Y = 1080;

    await this.browser.setWindowSize(BIG_X, BIG_Y);
    const bigElX = await this.browser.$('[data-testid=app]').getSize('width');
    await this.browser.setWindowSize(SMALL_X, SMALL_Y);
    const smallElX = await this.browser.$('[data-testid=app]').getSize('width');
    assert.isAbove(bigElX, smallElX);
  });

  it('На ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async function() {
    const width = 576;

    await this.browser.setWindowSize(width, 1080);
    assert.isTrue(await this.browser.$('.Application-Toggler').isDisplayed());
  });

  it('При выборе элемента из меню "гамбургера", меню должно закрываться', async function() {
    const width = 576;

    await this.browser.setWindowSize(width, 1080);
    assert.isFalse(await this.browser.$('.Application-Menu').isDisplayed());
    await (await this.browser.$('.Application-Toggler')).click();
    await (await this.browser.$('.nav-link')).click();
    await this.browser.$('.Application-Menu').waitForExist();
    assert.isFalse(await this.browser.$('.Application-Menu').isDisplayed());
  });
});
