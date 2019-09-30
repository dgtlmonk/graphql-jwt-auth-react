import React from 'react';

// implemetation here is intentional using shared hook
import {useStateHook, useStateReduce} from '../hooks';

const styles = {
  formShown: {maxWidth: `400px`},
  formHidden: {display: `none`},
  label: {display: `flex`, flexFlow: `column`, padding: `1em`},
  input: {padding: `8px`},
  button: {padding: `8px`, borderRadius: `4px`},
};

export default React.memo(function Login() {
  // warning: i'm using two variats of state hook updates here
  // for educational purpose - useState and useReducer
  const {state, updateState} = useStateHook();
  const {reduceState, updateReduceState} = useStateReduce({});

  async function handleSubmit(e: any) {
    e.preventDefault();
    const {email, password} = e.target.elements;

    if (!email.value || !password.value) {
      updateReduceState({
        ...reduceState,
        errors: 'invalid email or password',
      });
      return;
    }

    updateState({
      errors: '',
      successMessage: 'logged in',
    });
    console.log('form submitted');
  }

  return (
    <>
      <h2>Login</h2>
      {reduceState.errors && (
        <div data-testid="errors">{reduceState.errors}</div>
      )}
      {state.successMessage && (
        <div data-testid="status">{state.successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
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
            type="text"
            name="password"
            data-testid="password"
            style={styles.input}
          />
        </label>
        <button style={styles.button} type="submit">
          Submit{' '}
        </button>
      </form>
    </>
  );
});
