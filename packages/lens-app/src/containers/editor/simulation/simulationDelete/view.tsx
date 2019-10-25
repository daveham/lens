import React from 'react';
import { useSelector as useSelectorGeneric, TypedUseSelectorHook } from 'react-redux';

import { RootEditorState } from 'editor/modules';
import { simulationDeleteListSelector } from 'editor/modules/selectors';

import Layout from '../common/layout';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationDelete:view');

interface IProps {
  simulationId?: string;
}

const View = ({ simulationId }: IProps) => {
  const useSelector: TypedUseSelectorHook<RootEditorState> = useSelectorGeneric;

  const simulationDeleteList =
    // @ts-ignore
    useSelector(state => simulationDeleteListSelector(state, simulationId));

  return (
    <Layout title='Simulation'>
      {simulationDeleteList.map(({ key, label, name }) => (
        <div key={key}>{`${label}: ${name}`}</div>
      ))}
    </Layout>
  );
};

export default View;
