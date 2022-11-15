import {initStore} from '../../src/client/store';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {Application} from '../../src/client/Application';
import {render, screen} from '@testing-library/react';
import React from 'react';
import {CartApi, ExampleApi} from '../../src/client/api';
import {describe, test} from '@jest/globals';
import events from '@testing-library/user-event';


const createApplication: () => JSX.Element = () => {
    const api = new ExampleApi('');
    const store = initStore(api, new CartApi());
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Application/>
            </Provider>
        </BrowserRouter>
    );
};

interface TestingPage {
    linkName: string,
    className: string,
    testName: string
}

const TESTING_PAGES: TestingPage[] = [{
    linkName: 'example store',
    className: 'Home',
    testName: 'главная страница'
}, {
    linkName: 'catalog',
    className: 'Catalog',
    testName: 'каталог'
}, {
    linkName: 'delivery',
    className: 'Delivery',
    testName: 'доставка'
}, {
    linkName: 'contacts',
    className: 'Contacts',
    testName: 'контакты'
}];

describe('В магазине должны быть следующие страницы: ', () => {
    TESTING_PAGES.forEach((page) => {
        test(page.testName, async () => {
            const {container} = render(createApplication());
            await events.click(screen.getByRole('link', {
                name: new RegExp(`${page.linkName}`, 'i'),
            }));
            expect(container.getElementsByClassName(page.className)[0]).toBeDefined();
        })
    })
});

describe('В магазине должны иметь статическое содержимое следующие страницы: ', () => {
    TESTING_PAGES.forEach((page) => {
        test(page.testName, async () => {
            const {container} = render(createApplication());
            await events.click(screen.getByRole('link', {
                name: new RegExp(`${page.linkName}`, 'i'),
            }));
            const el = container.getElementsByClassName(page.className)[0];
            expect(el).toBeVisible();
            expect(el).not.toBeEmptyDOMElement();
        })
    })
});

