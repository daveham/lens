import React from 'react';
import styles from './styles.scss';

interface IProps {
  loading?: boolean;
  greeting?: string;
  requestHello: () => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount() {
    const alreadyFetched = this.props.loading || this.props.greeting;
    if (!alreadyFetched) {
      setTimeout(() => {
        this.props.requestHello();
      }, 500);
    }
  }

  public render() {
    return (
      <div className={styles.container}>
        <div className={styles.data}>
          <h1>Feature A</h1>
          <div>This is feature A.</div>
          {this.renderLoading()}
          {this.renderGreeting()}
        </div>
      </div>
    );
  }

  private renderLoading() {
    return (
      this.props.loading &&
        <div>loading...</div>
    );
  }

  private renderGreeting() {
    return (
      this.props.greeting &&
        <div>{this.props.greeting}</div>
    );
  }
}

export default View;
