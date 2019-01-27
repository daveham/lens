import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  label: {
    color: theme.palette.primary.light,
    paddingRight: theme.spacing.unit * 2,
  },
  prefix: {
    color: theme.palette.primary.dark,
    paddingRight: 2,
  },
});

interface IProps {
  classes?: any;
  simulationName: string;
  simulationLink: string;
  executionName: string;
  executionLink: string;
  renderingName: string;
  renderingLink: string;
}

function renderLabelElement(classes, label, link) {
  const labelElement = (
    <span className={classes.label}>
      {label}
    </span>
  );
  return link
    ? <a href={link}>{labelElement}</a>
    : labelElement;
}

function renderSegmentElement(classes, prefix, inner) {
  return (
    <Typography variant='subtitle1'>
      <span className={classes.prefix}>
        {prefix}:
      </span>
      {inner}
    </Typography>
  );
}

export const BreadcrumbBar = (props: IProps): any => {
  const {
    classes,
    simulationName, simulationLink,
    executionName, executionLink,
    renderingName, renderingLink
  } = props;

  return (
    <div className={classes.root}>
      {simulationName &&
        renderSegmentElement(classes, 'Simulation',
          renderLabelElement(classes, simulationName, simulationLink))}
      {executionName &&
        renderSegmentElement(classes, 'Execution',
          renderLabelElement(classes, executionName, executionLink))}
      {renderingName &&
      renderSegmentElement(classes, 'Rendering',
        renderLabelElement(classes, renderingName, renderingLink))}
    </div>
  );
};

export default withStyles(styles)(BreadcrumbBar);
