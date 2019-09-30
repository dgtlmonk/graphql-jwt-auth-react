/** @jsx jsx */
import {jsx} from '@emotion/core';
import React, {useReducer} from 'react';
import {useRegisterMutation} from '../generated/graphql';

const styles = {
  formShown: {maxWidth: `400px`},
  formHidden: {display: `none`},
  label: {display: `flex`, flexFlow: `column`, padding: `1em`},
  input: {padding: `8px`},
  button: {padding: `8px`, borderRadius: `4px`},
};
export default function Register() {
  const [register] = useRegisterMutation();
  const initialState = {
    errors: '',
    registerSuccces: null,
    formStyle: styles.formShown,
  };

  const [state, setState] = useReducer((o, n) => ({...o, ...n}), {
    ...initialState,
  });

  async function handleSubmit(e: any) {
    e.preventDefault();
    const emailPattern = RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    );
    const {email, password, password2} = e.target.elements;

    if (
      !email.value ||
      (!emailPattern.test(email.value) || !password.value)
    ) {
      setState({
        errors: 'invalid email or password',
        registerSuccces: false,
      });

      return;
    }

    if (password.value !== password2.value) {
      setState({
        errors: 'password did not match',
        registerSuccces: false,
      });

      return;
    }

    const resp: any = await register({
      variables: {email: email.value, password: password.value},
    });

    if (resp.data.register) {
      setState({
        errors: '',
        registerSuccess: true,
        successMessage: 'Register Success',
        formStyle: styles.formHidden,
      });
    }
  }

  return (
    <div>
      <h2>Register </h2>
      {state.errors && (
        <div data-testid="errors" style={{color: `red`}}>
          {state.errors}
        </div>
      )}
      {state.registerSuccess && (
        <div data-testid="status" style={{color: `blue`}}>
          Register Success
        </div>
      )}

      <form onSubmit={handleSubmit} style={state.formStyle}>
        <label htmlFor="email" style={styles.label}>
          email
          <input
            type="text"
            name="email"
            data-testid="email"
            style={styles.input}
          />
        </label>

        <label htmlFor="password" style={styles.label}>
          password
          <input
            type="password"
            name="password"
            data-testid="password"
            style={styles.input}
          />
        </label>
        <label htmlFor="password2" style={styles.label}>
          repeat password
          <input
            type="password"
            name="password2"
            data-testid="password2"
            style={styles.input}
          />
        </label>
        <button style={styles.button} type="submit">
          Submit{' '}
        </button>
      </form>
    </div>
  );
}
