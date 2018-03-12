import React from 'react';
import Tabs from '../Tabs';
import styles from './styles.scss';

const tabs = [
  'intro',
  'stack',
  'services',
  'environments'
];

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTabIndex: 0
    };
  }

  renderIntro() {
    return (
      <div>
        <p className={styles.normal}>
          Generate this image:
        </p>
        <img src='build/images/DMEvenGen500.jpg' alt='' className={styles.framedImage}/>
        <p className={styles.normal}>
          From this photo:
        </p>
        <img src='build/images/EveningCloudsDavisMountains500.jpg' alt=''
             className={styles.framedImage}/>
        <p className={styles.normal}>
          Detail:
        </p>
        <div className={styles.cutContainer}>
          <div>
            <img src='build/images/EveSrcCut.jpg' alt='' className={styles.framedImage}/>
          </div>
          <div>
            <img src='build/images/DMEvenCut.png' alt='' className={styles.framedImage}/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { currentTabIndex } = this.state;
    let content;
    if (currentTabIndex === 0) {
      content = this.renderIntro();
    } else {
      content = (
        <div>
          <p className={styles.normal}>
            {`Content for '${tabs[currentTabIndex]}' section.`}
          </p>
        </div>
      );
    }

    return (
      <div>
        <p className={styles.normal}>
          Lens is a tool for creating images by applying generative algorithms to photos.
        </p>
        <Tabs
          selectedIndex={this.state.currentTabIndex}
          titles={tabs}
          onTabClicked={this.handleTabClicked}
        />
        {content}
      </div>
    );
  }

  handleTabClicked = (index) => {
    if (index !== this.state.currentTabIndex) {
      this.setState({ currentTabIndex: index });
    }
  };
}
