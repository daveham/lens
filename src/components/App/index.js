import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../Home';
import ExampleComponent from '../ExampleComponent';
import PageNotFound from '../PageNotFound';
import styles from './styles.scss';

export default function App() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title} >Lens</h1>

      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/example' component={ExampleComponent} />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  );
}
