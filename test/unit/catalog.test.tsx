import React from 'react';
import {describe, test} from '@jest/globals';
import {render, screen} from "@testing-library/react";
import {createApplication} from "./test-utils";
import {ExampleApi} from "../../src/client/api";
import events from "@testing-library/user-event";

describe('Каталог', () => {
    test('должен отображать товары, список которых приходит с сервера (название, цена, ссылка)', async () => {
        const exampleApi = new ExampleApi('http://localhost:8000/hw/store');

        const application = createApplication(exampleApi, '/');
        render(application);
        await events.click(screen.getByRole('link', {
            name: /catalog/i
        }));

        const products = (await exampleApi.getProducts()).data;

        Array.from(Array(products .length).keys()).forEach(index => {
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
        const application = createApplication(exampleApi, '/hw/store');

        const {container} = render(application);
        await events.click(screen.getByRole('link', {
            name: /catalog/i
        }));
        const products = (await exampleApi.getProducts()).data;

        for (const index of Array.from(Array(products.length).keys())) {
            const product = screen.getAllByTestId(index).find(el => el.className.includes('ProductItem'));
            await events.click(product.getElementsByClassName('DetailsLink')[0]);

            const displayedProduct = container.getElementsByClassName('Product')[0];

            const elVisibleAndEqualByClass = (cl: string) => {
                const el = displayedProduct.getElementsByClassName(cl)[0];
                expect(el).toBeVisible();
                // @ts-ignore
                eq && expect(el).toEqual(productData[cl.split('-')[1]]);
            }

            const productData = (await exampleApi.getProductById(index)).data;
            ['ProductDetails-Name', 'ProductDetails-Description', 'ProductDetails-Price', 'ProductDetails-Color', 'ProductDetails-Material'].forEach(elVisibleAndEqualByClass);

            expect(displayedProduct.getElementsByClassName('ProductDetails-AddToCart')[0]).toBeVisible();
        }
    });
})
;
