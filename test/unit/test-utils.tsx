import {CartApi, ExampleApi} from "../../src/client/api";
import {initStore} from "../../src/client/store";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import React from "react";

export const createApplication: () => JSX.Element = () => {
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

export interface TestingPage {
    linkName: string,
    className: string,
    testName: string
}
export const TESTING_PAGES: TestingPage[] = [{
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
