import React from 'react';
import {useUsersQuery} from './generated/graphql';

function App() {
  const {data, loading} = useUsersQuery();
  if (loading || !data) {
    return <div>loading ..</div>;
  }

  return (
    <div className="App">
      {data.users.map(user => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}

export default App;
