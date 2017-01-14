import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Well from 'react-bootstrap/lib/Well';

import styles from './Counter.scss';

export const Counter = (props) => (
  <div className={styles.container}>
    <Well>
      <h1>
        Sample Counter:&nbsp;
        <span className='text-success'>{props.counter}</span>
      </h1>
      <ButtonGroup>
        <Button onClick={props.increment}>Increment</Button>
        <Button onClick={props.doubleAsync}>Double (Async)</Button>
      </ButtonGroup>
    </Well>
  </div>
);

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  doubleAsync: PropTypes.func.isRequired,
  increment: PropTypes.func.isRequired
};

export default Counter;
