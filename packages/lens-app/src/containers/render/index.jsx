import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styles from './styles.scss';

const GET_RENDERINGS = gql`
{
  renderings {
    id,
    name
  }
}
`;

const View = () => (
  <Query query={GET_RENDERINGS}>
    {(props) => {
      return (
        <div className={styles.container}>
          <div className={styles.data}>
            <h1>Renderings</h1>
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
  return renderRenderings(data);
}

function renderRenderings(data) {
  return data.renderings.map((r, index) => <div key={index}>{r.name}</div>);
}

function renderError(error) {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading() {
  return <div>'Loading...'</div>;
}

export default View;
