import React from 'react';
import {
  render,
  fireEvent,
  act,
  cleanup,
} from '@testing-library/react';

import {Login} from '..';
import {MockedProvider} from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import gql from 'graphql-tag';

jest.mock('../../generated/graphql', () => {
  return {
    useLoginMutation: jest.fn(() => [
      () =>
        Promise.resolve({
          data: {
            login: {
              accessToken: 'abcdefg123',
            },
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
          login(email: $email, password: $password)
        }
      `,
      variables: {
        email: 'foo@bar.com',
        password: 'somebody',
      },
    },
    result: {
      data: {
        login: {
          accessToken: 'abcdef122',
        },
      },
    },
  },
];

function MockAppWithLogin() {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Login />
    </MockedProvider>
  );
}
describe('Integration::', () => {
  let btnSubmit;
  let t;
  beforeEach(() => {
    const {getByText, getByTestId} = render(<MockAppWithLogin />);
    t = {
      getByText,
      getByTestId,
    };
  });

  afterAll(() => {
    cleanup();
  });

  it('Should: display invalid email error\n\t Given: empty email or password', () => {
    btnSubmit = t.getByText(/submit/i);
    fireEvent.click(btnSubmit);
    expect(t.getByTestId('errors')).toHaveTextContent(/invalid/i);

    fireEvent.change(t.getByTestId('email'), {
      target: {value: 'foo22@bar.com'},
    });

    fireEvent.click(btnSubmit);
    expect(t.getByTestId('errors')).toHaveTextContent(/invalid/i);
  });

  it('Should: display user logged in\n\t Given: valid email and password inputs', async () => {
    btnSubmit = t.getByText(/submit/i);

    fireEvent.change(t.getByTestId('email'), {
      target: {value: 'foo22@bar.com'},
    });

    fireEvent.change(t.getByTestId('password'), {
      target: {value: 'ok'},
    });

    await act(() => Promise.resolve(fireEvent.click(btnSubmit)));

    expect(t.getByTestId('status')).toHaveTextContent(/logged/i);
  });
});
