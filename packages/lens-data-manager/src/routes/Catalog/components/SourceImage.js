import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Busy from './Busy';
import styles from './SourceImage.scss';

const SourceImage = (props) => {
  const { id, thumb, thumbsLoading, generate } = props;
  if (thumbsLoading || thumb === 'busy') {
    return <Busy />;
  } else {
    if (thumb === 'ready') {
      const src = `/thumbs/${id}_thumb.jpg`;
      return <img className={styles.thumb} src={src} />;
    } else {
      const genButtonProps = {
        onClick: event => {
          event.preventDefault();
          generate(id);
        }
      };
      return <Button {...genButtonProps}>Generate</Button>;
    }
  }
};

SourceImage.propTypes = {
  id: PropTypes.string,
  thumb: PropTypes.string,
  thumbsLoading: PropTypes.bool,
  generate: PropTypes.func
};

SourceImage.defaultProps = {
  thumbsLoading: false,
  generate: () => {}
};

export default SourceImage;
