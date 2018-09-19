import React from 'react';
import styles from './styles.scss';

interface IProps {
  simulationName: string;
  simulationLink: string;
  executionName: string;
  executionLink: string;
  renderingName: string;
  renderingLink: string;
}

function renderLabelElement(label, link) {
  const labelElement = (
    <span className={styles.label}>
      {label}
    </span>
  );
  return link
    ? <a href={link}>{labelElement}</a>
    : labelElement;
}

function renderSegmentElement(prefix, inner) {
  return (
    <div className={styles.segment}>
      <span className={styles.prefix}>
        {prefix}:
      </span>
      {inner}
    </div>
  );
}

const BreadcrumbBar = (props: IProps): any => {
  const {
    simulationName, simulationLink,
    executionName, executionLink,
    renderingName, renderingLink
  } = props;

  return (
    <div className={styles.container}>
      {simulationName &&
        renderSegmentElement('Simulation', renderLabelElement(simulationName, simulationLink))}
      {executionName &&
        renderSegmentElement('Execution', renderLabelElement(executionName, executionLink))}
      {renderingName &&
      renderSegmentElement('Rendering', renderLabelElement(renderingName, renderingLink))}
    </div>
  );
};

export default BreadcrumbBar;
