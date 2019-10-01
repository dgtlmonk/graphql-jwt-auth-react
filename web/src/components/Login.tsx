import React from 'react';
import {useStateReduce} from '../hooks';
import {useLoginMutation} from '../generated/graphql';
const styles = {
  formShown: {maxWidth: `400px`},
  formHidden: {display: `none`},
  label: {display: `flex`, flexFlow: `column`, padding: `1em`},
  input: {padding: `8px`},
  button: {padding: `8px`, borderRadius: `4px`},
};

export default React.memo(() => {
  const {reduceState, updateReduceState} = useStateReduce({
    formStyle: styles.formShown,
  });

  const [login] = useLoginMutation();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const {email, password} = e.target.elements;

    if (!email.value || !password.value) {
      updateReduceState({
        errors: 'invalid email or password',
      });
      return;
    }

    try {
      const qry: any = await login({
        variables: {
          email: email.value,
          password: password.value,
        },
      });

      if (qry.data.login) {
        updateReduceState({
          formStyle: styles.formHidden,
          successMessage: `User logged in.\nAccess token: ${qry.data.login.accessToken}`,
        });
      }
    } catch (e) {
      console.log('failed ??');
      updateReduceState({
        errors: e.message,
        successMessage: '',
      });
    }
  }

  return (
    <>
      <h2>Login</h2>
      {reduceState.errors && (
        <div data-testid="errors">{reduceState.errors}</div>
      )}
      {reduceState.successMessage && (
        <div
          data-testid="status"
          style={{maxWidth: `400px`, wordBreak: `break-word`}}
        >
          <span>{reduceState.successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={reduceState.formStyle}>
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
        <button style={styles.button} type="submit">
          Submit{' '}
        </button>
      </form>
    </>
  );
});
