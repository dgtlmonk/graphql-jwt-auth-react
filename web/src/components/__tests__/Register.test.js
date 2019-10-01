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

// import {useRegisterMutation } from '../../generated/graphql'

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
  let t;
  beforeEach(() => {
    const {getByText, getByTestId} = render(
      <MockAppWithRegistration />,
    );
    t = {
      getByText,
      getByTestId,
    };
  });

  afterAll(() => {
    cleanup();
  });

  it('should display missing email error', () => {
    btnSubmit = t.getByText(/submit/i);
    fireEvent.click(btnSubmit);
    expect(getNodeText(t.getByTestId('errors'))).toMatch(/invalid/i);
  });

  it('should display missing password error', () => {
    btnSubmit = t.getByText(/submit/i);
    fireEvent.change(t.getByTestId('email'), {
      target: {value: 'foo22@bar.com'},
    });
    fireEvent.click(btnSubmit);

    expect(getNodeText(t.getByTestId('errors'))).toMatch(/invalid/i);
  });

  it('should display mismatched password error', () => {
    btnSubmit = t.getByText(/submit/i);

    fireEvent.change(t.getByTestId('email'), {
      target: {value: 'foo22@bar.com'},
    });
    fireEvent.change(t.getByTestId('password'), {
      target: {value: 'abce'},
    });

    fireEvent.change(t.getByTestId('password2'), {
      target: {value: 'abcd'},
    });
    fireEvent.click(btnSubmit);

    expect(getNodeText(t.getByTestId('errors'))).toMatch(
      /did not match/i,
    );
  });

  it('should display Register Success', async () => {
    btnSubmit = t.getByText(/submit/i);

    fireEvent.change(t.getByTestId('email'), {
      target: {value: 'foo22@bar.com'},
    });
    fireEvent.change(t.getByTestId('password'), {
      target: {value: 'abce'},
    });

    fireEvent.change(t.getByTestId('password2'), {
      target: {value: 'abce'},
    });

    await act(() => Promise.resolve(fireEvent.click(btnSubmit)));
    expect(getNodeText(t.getByTestId('status'))).toMatch(/success/i);
  });
});
