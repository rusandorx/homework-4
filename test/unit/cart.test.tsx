import React from 'react';
import {describe, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createApplication, fillStore} from './test-utils';
import {CartApi, ExampleApi} from '../../src/client/api';
import {initStore} from '../../src/client/store';
import {Application} from '../../src/client/Application';
import {Cart} from '../../src/client/pages/Cart';

describe('Корзина', () => {
    test('должна отображать кол-во не повторяющихся товаров в ней', async () => {
        const application = createApplication();
        const exampleApi = new ExampleApi('http://localhost:8000/hw/store');
        const store = initStore(exampleApi, new CartApi());

        const {container} = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </BrowserRouter>,
        );
        await fillStore(store, exampleApi);
        const itemsCount = Object.keys(store.getState().cart).length;
        expect(screen.getByTestId('cart-icon').textContent.match(/\(([^\)]+)\)/)[1]).toEqual(itemsCount.toString());
    });

    test('должна отображат таблицу с добавленными в нее товарами, а так же для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', async () => {
        const application = createApplication();
        const exampleApi = new ExampleApi('http://localhost:8000/hw/store');
        const store = initStore(exampleApi, new CartApi());

        const {container} = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </BrowserRouter>,
        );

        await fillStore(store, exampleApi);
        expect(container).toBeVisible();
        const table = container.getElementsByClassName('Cart-Table')[0];
        expect(table).toBeVisible();
        const products = store.getState().cart;
        for (const [id, product] of Object.entries(products)) {
            const productCell = screen.getByTestId(id);
            expect(productCell.getElementsByClassName('Cart-Name')[0].textContent).toEqual(product.name.toString());
            expect(productCell.getElementsByClassName('Cart-Price')[0].textContent).toEqual(`$${product.price}`);
            expect(productCell.getElementsByClassName('Cart-Count')[0].textContent).toEqual(product.count.toString());
            expect(productCell.getElementsByClassName('Cart-Total')[0].textContent).toEqual(`$${product.count * product.price}`);
        }
    });


});
