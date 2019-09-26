import React, {useState} from 'react';
import {useRegisterMutation} from '../generated/graphql';

const styles = {
  form: {maxWidth: `400px`},
  label: {display: `flex`, flexFlow: `column`, padding: `1em`},
  input: {padding: `8px`},
  button: {padding: `8px`},
};
export default function Register() {
  const [register] = useRegisterMutation();
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: any) {
    e.preventDefault();
    const emailPattern = RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    );
    const {email, password, password2} = e.target.elements;

    setErrors('');
    if (
      !email.value ||
      !emailPattern.test(email.value) ||
      !password
    ) {
      setErrors('invalid email or password');
      return;
    }

    if (password.value !== password2.value) {
      setErrors('password did not match');
      return;
    }

    const resp: any = await register({
      variables: {email: email.value, password: password.value},
    });

    if (resp.data.register) {
      setSuccess('Register success');
    }
  }

  return (
    <div>
      <h2>Register Page</h2>
      {errors && <div style={{color: `red`}}>{errors}</div>}
      {success && <div style={{color: `blue`}}>{success}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
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
