import React, { Component, PropTypes } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Busy from './Busy';
import SourceItemTitle from './SourceItemTitle';
import SourceItemDetails from './SourceItemDetails';
import SourceImage from './SourceImage';

import styles from './SourceItem.scss';

class SourceItem extends Component {
  static get propTypes() {
    return {
      id: PropTypes.string,
      name: PropTypes.string,
      thumb: PropTypes.string,
      thumbsLoading: PropTypes.bool,
      metadata: PropTypes.object,
      select: PropTypes.func,
      generate: PropTypes.func,
      clear: PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      id: '0',
      name: '',
      metadata: {},
      thumb: null,
      thumbsLoading: false,
      select: () => {},
      generate: () => {},
      clear: () => {}
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleToggle() {
    const { id, select, metadata } = this.props;
    const { expanded } = this.state;
    const loaded = metadata && metadata.loading === false && metadata.status && metadata.status.length > 0;
    if (!metadata.loading) {
      if (!(expanded || loaded)) {
        select(id);
      }
      this.setState({ expanded: !expanded });
    }
  }

  handleClear(id) {
    this.setState({ expanded: false });
    this.props.clear(id);
  }

  render() {
    const { id, name, thumb, thumbsLoading, generate, metadata } = this.props;
    const { expanded } = this.state;
    const busy = metadata && metadata.loading;

    const title = (
      <SourceItemTitle
        name={name}
        expanded={expanded}
        toggle={this.handleToggle.bind(this)}
      >
        <Busy busy={busy} />
      </SourceItemTitle>
    );

    let content = null;
    if (expanded) {
      const image = <SourceImage
        id={id}
        thumb={thumb}
        thumbsLoading={thumbsLoading}
        generate={generate}
      />;

      let details = null;
      if (!metadata.loading) {
        details = <SourceItemDetails
          id={id}
          error={metadata.error}
          filename={metadata.filename}
          status={metadata.status}
          size={metadata.size}
          ctime={metadata.ctime}
          format={metadata.format}
          width={metadata.width}
          height={metadata.height}
          depth={metadata.depth}
          filesize={metadata.filesize}
          resolution={metadata.resolution}
          clear={this.handleClear.bind(this)}
        />;
      }

      content = (
        <div className={styles.content}>
          <div>{image}</div>
          <div className={styles.details}>{details}</div>
        </div>
      );
    }

    return (
      <Panel header={title} collapsible expanded={this.state.expanded}>
        {content}
      </Panel>
    );
  }
}

export default SourceItem;
