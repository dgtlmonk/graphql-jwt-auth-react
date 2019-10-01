import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GenericResponse = {
  __typename?: 'GenericResponse';
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponse;
  register: GenericResponse;
};

export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type MutationRegisterArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  users: Array<User>;
  hello: Scalars['String'];
  unauthorized: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email: Scalars['String'];
};
export type RegisterMutationVariables = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type RegisterMutation = {__typename?: 'Mutation'} & {
  register: {__typename?: 'GenericResponse'} & Pick<
    GenericResponse,
    'success' | 'message'
  >;
};

export type UsersQueryVariables = {};

export type UsersQuery = {__typename?: 'Query'} & {
  users: Array<{__typename?: 'User'} & Pick<User, 'id' | 'email'>>;
};

export const RegisterDocument = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      success
      message
    }
  }
`;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

export function useRegisterMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(RegisterDocument, baseOptions);
}
export type RegisterMutationHookResult = ReturnType<
  typeof useRegisterMutation
>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<
  RegisterMutation
>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const UsersDocument = gql`
  query Users {
    users {
      id
      email
    }
  }
`;

export function useUsersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UsersQuery,
    UsersQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    baseOptions,
  );
}
export function useUsersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UsersQuery,
    UsersQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    UsersQuery,
    UsersQueryVariables
  >(UsersDocument, baseOptions);
}

export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<
  UsersQuery,
  UsersQueryVariables
>;
