import React from 'react';
import {
  getNodeText,
  render,
  fireEvent,
  act,
} from '@testing-library/react';
import {assert} from '../../helpers/test/assert';

import {Register} from '..';
import {MockedProvider} from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import gql from 'graphql-tag';

jest.mock('../../generated/graphql', () => {
  return {
    useRegisterMutation: jest.fn(() => [
      () =>
        Promise.resolve({
          data: {
            register: true,
          },
        }),
    ]),
  };
});

const mocks = [
  {
    request: {
      query: gql`
        {
          register(email: $email, password: $password)
        }
      `,
      variables: {
        email: 'foo@bar.com',
        password: 'somebody',
      },
    },
    result: {
      data: {
        register: true,
      },
    },
  },
];

function MockAppWithRegistration() {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Register />
    </MockedProvider>
  );
}
describe('Registration', () => {
  const {getByText, getByTestId} = render(
    <MockAppWithRegistration />,
  );

  const btnSubmit = getByText(/submit/i);

  // missing email
  fireEvent.click(btnSubmit);
  assert.toMatch({
    given: 'a missing email input',
    should: 'display error',
    actual: getNodeText(getByTestId('errors')) || false,
    expected: /invalid/i,
  });

  // missing password
  fireEvent.change(getByTestId('email'), {
    target: {value: 'foo22@bar.com'},
  });
  fireEvent.click(btnSubmit);

  assert.toMatch({
    given: 'a missing password input',
    should: 'display error',
    actual: getNodeText(getByTestId('errors')) || false,
    expected: /invalid/i,
  });

  // mismatched password
  fireEvent.change(getByTestId('password'), {
    target: {value: '112'},
  });
  fireEvent.change(getByTestId('password2'), {
    target: {value: '11'},
  });

  fireEvent.click(btnSubmit);
  // await act(() => {
  /* fire events that update state */
  // fireEvent.click(btnSubmit);
  // });

  // assert.toMatch({
  //   given: 'a valid email and password',
  //   should: 'display Register Success',
  //   actual: getNodeText(getByTestId('status')) || false,
  //   expected: /success/i,
  // });

  assert.toMatch({
    given: 'a mismatched password input',
    should: 'display error',
    actual: getNodeText(getByTestId('errors')) || false,
    expected: /did not/i,
  });

  // FIXME: need to check testing on apollo-react-hooks
  fireEvent.change(getByTestId('password'), {
    target: {value: 'ok'},
  });
  fireEvent.change(getByTestId('password2'), {
    target: {value: 'ok'},
  });

  // FIXME: assert helper needs to handle async calls
});
