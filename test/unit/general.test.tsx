import React from 'react';
import { describe, test } from '@jest/globals';
import { getByRole, render, screen } from '@testing-library/react';
import { createApplication, TESTING_PAGES } from './test-utils';

describe('Тесты для всей страницы: ', () => {
  test('В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
    const application = createApplication();
    const { container } = render(application);
    const navbar = screen.getByTestId('navbar');
    TESTING_PAGES.forEach(({ linkName }) => {
      expect(navbar).toContainElement(getByRole(container, 'link', { name: new RegExp(linkName, 'i') }));
    });
    expect(navbar).toContainElement(getByRole(container, 'link', { name: /cart/i }));
  });

  test('название магазина в шапке должно быть ссылкой на главную страницу', () => {
    const application = createApplication();
    render(application);
    expect(screen.getByRole('link', {
      name: /example store/i,
    }).getAttribute('href')).toEqual('/');
  });
});
