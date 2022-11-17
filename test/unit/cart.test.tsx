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
import events from "@testing-library/user-event";
import {Store} from "redux";
import {Product} from "puppeteer";

let store: Store, exampleApi: ExampleApi;
beforeEach(() => {
    exampleApi = new ExampleApi('http://localhost:8000/hw/store');
    store = initStore(exampleApi, new CartApi());
})

describe('Корзина', () => {
    test('должна отображать кол-во не повторяющихся товаров в ней', async () => {
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
        for (const [id, product] of Object.entries(products) as [any, Product]) {
            const productCell = screen.getByTestId(id);
            expect(productCell.getElementsByClassName('Cart-Name')[0].textContent).toEqual(product.name.toString());
            expect(productCell.getElementsByClassName('Cart-Price')[0].textContent).toEqual(`$${product.price}`);
            expect(productCell.getElementsByClassName('Cart-Count')[0].textContent).toEqual(product.count.toString());
            expect(productCell.getElementsByClassName('Cart-Total')[0].textContent).toEqual(`$${product.count * product.price}`);
        }
    });

    test('должна отображать кнопку "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
        const {container} = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </BrowserRouter>,
        );

        await fillStore(store, exampleApi);
        expect(store.getState().cart).not.toEqual({});
        await events.click(screen.getByTestId('clear-btn'));
        expect(store.getState().cart).toEqual({});
    });

    test('если пустая, должна отображаться ссылка на каталог товаров', async () => {
        const {container} = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Cart/>
                </Provider>
            </BrowserRouter>,
        );
        expect(store.getState().cart).toEqual({});
        expect(container).toContainElement(screen.getByRole('link', {
            name: /catalog/i
        }));
    });

});
