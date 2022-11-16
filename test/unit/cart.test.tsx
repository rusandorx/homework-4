import React from 'react';
import {describe, test} from '@jest/globals';
import {createApplication} from "./test-utils";

describe('Корзина', () => {
    test('должна отображать кол-во не повторяющихся товаров в ней', () => {
        createApplication();
    })
})
