import React from 'react';

const styles = {
  formShown: {maxWidth: `400px`},
  formHidden: {display: `none`},
  label: {display: `flex`, flexFlow: `column`, padding: `1em`},
  input: {padding: `8px`},
  button: {padding: `8px`, borderRadius: `4px`},
};

export default function Login() {
  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log('form submitted');
  }

  return (
    <>
      <h2>Login</h2>
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
}
