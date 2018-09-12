import React from 'react';
import moment from 'moment';
import { timestampFormat } from 'editor/constants';
import FormContainer from 'editor/components/formContainer';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:renderingDelete:form');

interface IProps {
  created: number;
  modified: number;
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
  tag: string;
}

export default ({
  created,
  modified,
  name,
  onCancel,
  onConfirm,
  tag
}: IProps) => (
  <FormContainer
    onCancel={onCancel}
    onConfirm={onConfirm}
    tag={tag}
  >
    <div>{name}</div>
    <div>modified: {moment(modified).format(timestampFormat)}</div>
    <div>created: {moment(created).format(timestampFormat)}</div>
  </FormContainer>
);
