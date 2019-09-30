/* eslint-disable no-unused-vars */
import {useState, useReducer} from 'react';

// with useReducer
const useStateReduce = initialState => {
  const [reduceState, updateReduceState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    initialState,
  );

  return {reduceState, updateReduceState};
};

// with useState
const useStateHook = () => {
  const [state, updateState] = useState({
    errors: '',
    successMessage: '',
  });

  return {state, updateState};
};

export {useStateHook, useStateReduce};
