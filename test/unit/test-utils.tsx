import {CartApi, ExampleApi} from "../../src/client/api";
import {initStore} from "../../src/client/store";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import React from "react";

export const createApplication: (exampleApi?: ExampleApi, basename?: string)
    => JSX.Element = (exampleApi = new ExampleApi('http://localhost:8000/hw/store'), basename: string = '/hw/store') => {
    const store = initStore(exampleApi, new CartApi());
    return (
        <BrowserRouter basename={basename}>
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
