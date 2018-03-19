import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Pin from '../../Pin';
import Tabs from '../../Tabs';
import Status from './Status';
import History from './History';
import styles from './styles.scss';

const root = '/info/code';
const tabs = [
  'status',
  'history'
];
const paths = tabs.map((tab) => `${root}/${tab}`);

export default () => {
  return (
    <div>
      <Pin>
        <Tabs
          titles={tabs}
          paths={paths}
          horizontal={false}
        />
      </Pin>
      <Pin>
        <div className={styles.icon}>
          <a href='https://github.com/daveham/lens'>
            <FontAwesomeIcon icon={['fab', 'github']} size='2x' pull='right' />
          </a>
        </div>
      </Pin>
      <Switch>
        <Route path={paths[1]} component={History}/>
        <Redirect exact from={root} to={paths[0]}/>
        <Route component={Status}/>
      </Switch>
    </div>
  );
};
