const {assert} = require('chai');

describe('Каталог: ', function () {
    it('На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину', async function () {
        await this.browser.url('http://localhost:8000/hw/store/catalog/0');
        await this.browser.assertView('catalog-page', '.Product', {
            compositeImage: true,
            ignoreElements: ['.Image', '.ProductDetails-Name', '.ProductDetails-Description', '.ProductDetails-Price', '.ProductDetails-Color', '.ProductDetails-Material']
        })
    })
})
