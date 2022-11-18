import React from 'react';
import {describe, test} from '@jest/globals';
import {getByRole, render, screen} from "@testing-library/react";
import {CartApi, ExampleApi} from "../../src/client/api";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {initStore} from "../../src/client/store";
import {ProductDetails} from "../../src/client/components/ProductDetails";
import {Catalog} from "../../src/client/pages/Catalog";
import events from "@testing-library/user-event";
import {Application} from "../../src/client/Application";
import {Product} from "../../src/client/pages/Product";
import {UnsubscriptionError} from "rxjs";
import {fillStore} from "./test-utils";

describe('Каталог', () => {
    test('должен отображать товары, список которых приходит с сервера (название, цена, ссылка)', async () => {
        const exampleApi = new ExampleApi('http://localhost:8000/hw/store');

        render(<BrowserRouter>
            <Provider store={initStore(exampleApi, new CartApi())}>
                <Catalog/>
            </Provider>
        </BrowserRouter>);

        const products = (await exampleApi.getProducts()).data;

        Array.from(Array(products.length).keys()).forEach(index => {
            const product = screen.getAllByTestId(index).find(el => el.className.includes('ProductItem'));
            expect(product.getElementsByClassName('ProductItem-Name')[0]).toBeVisible();
            expect(product.getElementsByClassName('ProductItem-DetailsLink')[0]).toBeVisible();
            expect(product.getElementsByClassName('ProductItem-Price')[0]).toBeVisible();
            expect(product.getElementsByClassName('ProductItem-Name')[0].textContent).toEqual(products [index].name);
            expect(product.getElementsByClassName('ProductItem-Price')[0].textContent).toEqual('$' + products [index].price);
            expect(product.getElementsByClassName('ProductItem-DetailsLink')[0].textContent).toEqual('Details');
        })
    });

    test('На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async () => {
        const exampleApi = new ExampleApi('http://localhost:8000/hw/store');
        const products = (await exampleApi.getProducts()).data;
        for (const {id} of products) {
            const product = (await exampleApi.getProductById(id)).data;
            expect(product.id).toEqual(id);
            const {container} = render(
                <BrowserRouter>
                    <Provider store={initStore(exampleApi, new CartApi())}>
                        <ProductDetails product={product}/>
                    </Provider>
                </BrowserRouter>
            );

            expect(container.getElementsByClassName('ProductDetails-Name')[0]).toBeVisible();
            expect(container.getElementsByClassName('ProductDetails-Name')[0].textContent).toEqual(product.name);
            expect(container.getElementsByClassName('ProductDetails-Description')[0]).toBeVisible();
            expect(container.getElementsByClassName('ProductDetails-Description')[0].textContent).toEqual(product.description);
            expect(container.getElementsByClassName('ProductDetails-Price')[0]).toBeVisible();
            expect(container.getElementsByClassName('ProductDetails-Price')[0].textContent).toEqual('$' + product.price);
            expect(container.getElementsByClassName('ProductDetails-AddToCart')[0]).toBeVisible();
            expect(container.getElementsByClassName('ProductDetails-Color')[0]).toBeVisible();
            expect(container.getElementsByClassName('ProductDetails-Color')[0].textContent).toEqual(product.color);
            expect(container.getElementsByClassName('ProductDetails-Material')[0]).toBeVisible();
            expect(container.getElementsByClassName('ProductDetails-Material')[0].textContent).toEqual(product.material);
        }
    });

    test('Если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
        const exampleApi = new ExampleApi('http://localhost:8000/hw/store');
        const store = initStore(exampleApi, new CartApi());

        const {container} = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </BrowserRouter>);

        await events.click(screen.getByRole('link', { name: /catalog/i }))
        const product = (await exampleApi.getProductById((await exampleApi.getProducts()).data[0].id)).data;

        store.dispatch({type: 'ADD_TO_CART', product})
        const productEl = screen.getAllByTestId(product.id).find(el => el.className.includes('ProductItem'));

        expect(productEl.getElementsByClassName('CartBadge')[0]).toBeVisible();
        await events.click(getByRole(productEl, 'link', {
            name: /details/i
        }));
        await new Promise(resolve => setTimeout(() => resolve(null), 10))
        expect(container.getElementsByClassName('CartBadge')[0]).toBeVisible();
    });

    test('Если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
        const exampleApi = new ExampleApi('http://localhost:8000/hw/store');
        const store = initStore(exampleApi, new CartApi());
        const product = (await exampleApi.getProductById((await exampleApi.getProducts()).data[0].id)).data;

        const {container} = render(
            <BrowserRouter>
                <Provider store={store}>
                    <ProductDetails product={product}/>
                </Provider>
            </BrowserRouter>);

        const cart = () => store.getState().cart;
        expect(cart()).toHaveProperty(product.id.toString());
        await events.click(container.getElementsByClassName('ProductDetails-AddToCart')[0])
        await new Promise(resolve => setTimeout(() => resolve(null), 100))
        expect(cart()[product.id].count).toEqual(2);
    });

    test('Содержимое корзины должно сохраняться между перезагрузками страницы', async () => {
        // Мок функции перезагрузки страницы
        const location: Location = window.location;
        delete window.location;

        window.location = {
            ...location,
            reload: jest.fn()
        }

        const exampleApi = new ExampleApi('http://localhost:8000/hw/store');
        const store = initStore(exampleApi, new CartApi());

        const {container} = render(
            <BrowserRouter>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </BrowserRouter>);

        await fillStore(store, exampleApi);
        const prevCart = store.getState().cart;

        window.location.reload();

        const newCart = store.getState().cart;

        expect(prevCart).toEqual(newCart);
        expect(window.location.reload).toHaveBeenCalledTimes(1);

        jest.restoreAllMocks();
        window.location = location;
    })
});
