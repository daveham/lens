import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

const SourceItemDetailsClearButton = (props) => {

  return <Button
    bsSize='small'
    onClick={
      event => {
        event.preventDefault();
        props.clear(props.id);
      }
    }>Clear</Button>;
};

SourceItemDetailsClearButton.propTypes = {
  id: PropTypes.string,
  clear: PropTypes.func
};

SourceItemDetailsClearButton.defaultProps = {
  clear: () => {}
};

export default SourceItemDetailsClearButton;
