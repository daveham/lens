import React from 'react';
import { useSelector as useSelectorGeneric, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import ReadOnlyTextField from 'editor/components/readOnlyTextField';
import Layout from '../../simulation/common/layout';

import { RootEditorState } from 'editor/modules';
import { simulationsLoadingSelector, selectedRenderingSelector } from 'editor/modules/selectors';

import { changeRendering } from 'editor/modules/actions/sagas';

import _debug from 'debug';
const debug = _debug('lens:editor:rendering:renderingShow:view');

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
  renderingId?: string;
}

const View = (props: IProps) => {
  const useSelector: TypedUseSelectorHook<RootEditorState> = useSelectorGeneric;
  const simulationsLoading = useSelector(simulationsLoadingSelector);

  const selectedRendering = useSelector(selectedRenderingSelector);
  debug('View', { simulationsLoading, selectedRendering });

  const { editMode, newMode } = props;
  const editable = editMode || newMode;
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleRenderingFieldChange = ({ target: { name, value } }) =>
    dispatch(changeRendering({ changes: { [name]: value } }));

  const renderContent = () => {
    if (simulationsLoading) {
      return null;
    }

    if (!(selectedRendering && (selectedRendering.name || selectedRendering.nameError))) {
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
              value={selectedRendering.name}
              fullWidth
              disabled
            />
          )}
          {editable && (
            <TextField
              label='Name'
              margin='normal'
              multiline
              onChange={handleRenderingFieldChange}
              inputProps={{
                name: 'name',
                id: 'rendering-name',
              }}
              value={selectedRendering.name}
              helperText={selectedRendering.nameError}
              error={Boolean(selectedRendering.nameError)}
              fullWidth
              required
            />
          )}
        </div>
      </div>
    );
  };

  return <Layout title='Rendering'>{renderContent()}</Layout>;
};

export default View;
