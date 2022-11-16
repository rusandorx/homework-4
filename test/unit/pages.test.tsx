import {render, screen} from '@testing-library/react';
import React from 'react';
import {describe, test} from '@jest/globals';
import events from '@testing-library/user-event';
import {createApplication, TESTING_PAGES} from "./test-utils";

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

