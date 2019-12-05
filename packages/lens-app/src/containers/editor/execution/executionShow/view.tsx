import React from 'react';
import { useSelector as useSelectorGeneric, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import ReadOnlyTextField from 'editor/components/readOnlyTextField';
import Layout from '../../simulation/common/layout';

import { RootEditorState } from 'editor/modules';
import { simulationsLoadingSelector, selectedExecutionSelector } from 'editor/modules/selectors';

import { changeExecution } from 'editor/modules/actions/sagas';

import _debug from 'debug';
const debug = _debug('lens:editor:execution:executionShow:view');

const useStyles: any = makeStyles((theme: any) => {
  const paddingHalf = theme.spacing(1);
  const padding = paddingHalf * 2;
  return {
    root: {
      flex: '1 0 auto',
      display: 'flex',
    },
    contents: {
      // width: theme.spacing(formTitleWidthSpacingMultiplier),
      // borderRight: `solid 1px ${theme.palette.divider}`,
      padding: `${paddingHalf}px ${padding}px ${padding}px`,
      display: 'flex',
      flexDirection: 'column',
    },
  };
});

interface IProps {
  editMode?: boolean;
  newMode?: boolean;
  sourceId: string;
  simulationId?: string;
  executionId?: string;
}

const View = (props: IProps) => {
  const useSelector: TypedUseSelectorHook<RootEditorState> = useSelectorGeneric;
  const simulationsLoading = useSelector(simulationsLoadingSelector);

  const selectedExecution = useSelector(selectedExecutionSelector);
  debug('View', { simulationsLoading, selectedExecution });

  const { editMode, newMode } = props;
  const editable = editMode || newMode;
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleExecutionFieldChange = ({ target: { name, value } }) =>
    dispatch(changeExecution({ changes: { [name]: value } }));

  const renderContent = () => {
    if (simulationsLoading) {
      return null;
    }

    if (!(selectedExecution && (selectedExecution.name || selectedExecution.nameError))) {
      return null;
    }

    return (
      <div className={classes.root}>
        <div className={classes.contents}>
          {!editable && (
            <ReadOnlyTextField
              label='Name'
              margin='dense'
              multiline
              value={selectedExecution.name}
              fullWidth
              disabled
            />
          )}
          {editable && (
            <TextField
              label='Name'
              margin='normal'
              multiline
              onChange={handleExecutionFieldChange}
              inputProps={{
                name: 'name',
                id: 'execution-name',
              }}
              value={selectedExecution.name}
              helperText={selectedExecution.nameError}
              error={Boolean(selectedExecution.nameError)}
              fullWidth
              required
            />
          )}
        </div>
      </div>
    );
  };

  return <Layout title='Execution'>{renderContent()}</Layout>;
};

export default View;
