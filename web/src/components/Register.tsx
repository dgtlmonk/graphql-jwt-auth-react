import React, {useState, useReducer} from 'react';
import {useRegisterMutation} from '../generated/graphql';

const styles = {
  formShown: {maxWidth: `400px`},
  formHidden: {display: `none`},
  label: {display: `flex`, flexFlow: `column`, padding: `1em`},
  input: {padding: `8px`},
  button: {padding: `8px`},
};
export default function Register() {
  const [register] = useRegisterMutation();
  const initialState = {
    errors: '',
    registerSuccces: null,
    formStyle: styles.formShown,
  };

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {...initialState},
  );

  async function handleSubmit(e: any) {
    e.preventDefault();
    const emailPattern = RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    );
    const {email, password, password2} = e.target.elements;

    if (
      !email.value ||
      !emailPattern.test(email.value) ||
      !password
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
      console.log('register success');
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
      <h2>Register Page</h2>
      {state.errors && (
        <div style={{color: `red`}}>{state.errors}</div>
      )}
      {state.registerSuccess && (
        <div style={{color: `blue`}}>Register Success</div>
      )}

      <form onSubmit={handleSubmit} style={state.formStyle}>
        <label htmlFor="email" style={styles.label}>
          email
          <input type="text" name="email" style={styles.input} />
        </label>

        <label htmlFor="password" style={styles.label}>
          password
          <input
            type="password"
            name="password"
            style={styles.input}
          />
        </label>
        <label htmlFor="password2" style={styles.label}>
          repeat password
          <input
            type="password"
            name="password2"
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
