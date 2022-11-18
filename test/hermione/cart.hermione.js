const {assert} = require('chai');

describe('Корзина: ', function () {
    it('При правильно оформленном заказе отображается зеленое окошко', async function() {
        await this.browser.url('http://localhost:8000/hw/store/catalog/0');
        await this.browser.$('.ProductDetails-AddToCart').click();
        await this.browser.url('http://localhost:8000/hw/store/cart');
        await this.browser.$('[data-testid=input-name]').setValue('Random name');
        await this.browser.$('[data-testid=input-phone]').setValue('75245539831');
        await this.browser.$('[data-testid=input-address]').setValue('Random address');
        await this.browser.$('[data-testid=submit-form-btn]').click();
        await this.browser.$('.Cart').waitForExist();
        await this.browser.assertView('plain', '.Cart', {
            compositeImage: true,
            ignoreElements: '.Cart-Number',
        });
    })
})
