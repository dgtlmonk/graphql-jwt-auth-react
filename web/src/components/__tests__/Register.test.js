import React from 'react';
import {
  getNodeText,
  render,
  fireEvent,
  act,
  cleanup,
} from '@testing-library/react';

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
describe('Integration::Registration', () => {
  let btnSubmit;

  it('should display missing email error', () => {
    const {getByText, getByTestId} = render(
      <MockAppWithRegistration />,
    );

    btnSubmit = getByText(/submit/i);
    fireEvent.click(btnSubmit);
    expect(getNodeText(getByTestId('errors'))).toMatch(/invalid/i);
    cleanup();
  });

  it('should display missing password error', () => {
    const {getByText, getByTestId} = render(
      <MockAppWithRegistration />,
    );

    btnSubmit = getByText(/submit/i);
    fireEvent.change(getByTestId('email'), {
      target: {value: 'foo22@bar.com'},
    });
    fireEvent.click(btnSubmit);

    expect(getNodeText(getByTestId('errors'))).toMatch(/invalid/i);
    cleanup();
  });

  it('should display mismatched password error', () => {
    const {getByText, getByTestId} = render(
      <MockAppWithRegistration />,
    );

    btnSubmit = getByText(/submit/i);

    fireEvent.change(getByTestId('email'), {
      target: {value: 'foo22@bar.com'},
    });
    fireEvent.change(getByTestId('password'), {
      target: {value: 'abce'},
    });

    fireEvent.change(getByTestId('password2'), {
      target: {value: 'abcd'},
    });
    fireEvent.click(btnSubmit);

    expect(getNodeText(getByTestId('errors'))).toMatch(
      /did not match/i,
    );
    cleanup();
  });

  it('should display Register Success', async () => {
    const {getByText, getByTestId} = render(
      <MockAppWithRegistration />,
    );

    btnSubmit = getByText(/submit/i);

    fireEvent.change(getByTestId('email'), {
      target: {value: 'foo22@bar.com'},
    });
    fireEvent.change(getByTestId('password'), {
      target: {value: 'abce'},
    });

    fireEvent.change(getByTestId('password2'), {
      target: {value: 'abce'},
    });

    await act(() => Promise.resolve(fireEvent.click(btnSubmit)));
    expect(getNodeText(getByTestId('status'))).toMatch(/success/i);
    cleanup();
  });
});
