import React from 'react';
import {getNodeText, render, fireEvent} from '@testing-library/react';
import {assert} from '../../helpers/test/assert';
import {useRegisterMutation} from '../../generated/graphql';

import {Register} from '../../components';
import {MockedProvider} from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import gql from 'graphql-tag';

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
  // const [register] = useRegisterMutation();

  // register = jest.fn();

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

  fireEvent.click(btnSubmit);
  assert.toMatch({
    given: 'a missing email input',
    should: 'display error',
    actual: getNodeText(getByTestId('errors')) || false,
    expected: /invalid/i,
  });

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

  fireEvent.change(getByTestId('password'), {
    target: {value: '112'},
  });
  fireEvent.change(getByTestId('password2'), {
    target: {value: '111'},
  });

  fireEvent.click(btnSubmit);
  assert.toMatch({
    given: 'a mismatched password input',
    should: 'display error',
    actual: getNodeText(getByTestId('errors')) || false,
    expected: /did not/i,
  });

  // FIXME: need to check testing on apollo-react-hooks
  // fireEvent.change(getByTestId('password'), {
  //   target: {value: '111'},
  // });
  // fireEvent.change(getByTestId('password2'), {
  //   target: {value: '111'},
  // });

  // fireEvent.click(btnSubmit);
  // assert.toMatch({
  //   given: 'a valid email and password',
  //   should: 'display Register Success',
  //   actual: getNodeText(getByTestId('status')) || false,
  //   expected: /success/i,
  // });
});
