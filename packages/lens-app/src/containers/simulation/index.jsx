import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styles from './styles.scss';

const GET_SIMULATIONS = gql`
{
  simulations {
    id,
    name
  }
}
`;

const View = () => (
  <Query query={GET_SIMULATIONS}>
    {(props) => {
      return (
        <div className={styles.container}>
          <div className={styles.data}>
            <h1>Simulation</h1>
            {renderContents(props)}
          </div>
        </div>
      );
    }}
  </Query>
);

function renderContents({ loading, error, data}) {
  if (loading) return renderLoading();
  if (error) return renderError(error);
  return renderSimulations(data);
}

function renderSimulations(data) {
  return data.simulations.map((s, index) => <div key={index}>{s.name}</div>);
}

function renderError(error) {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading() {
  return <div>'Loading...'</div>;
}

export default View;
