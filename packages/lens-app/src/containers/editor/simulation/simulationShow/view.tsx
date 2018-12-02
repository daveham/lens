import React from 'react';
import { ISimulation } from 'editor/interfaces';

import Form from '../common/form';
import Tabs from '../common/tabs';
import Hike from '../common/hike';
import Trails from '../common/trails';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationShow:view');

interface IProps {
  sourceId: string;
  simulationId: number;
  simulation: ISimulation;
  loading: boolean;
}

interface IState {
  hikeType: string;
  hikeSize: string;
  hikeLogger: string;
  hikeTrackWriter: string;
}

class View extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      hikeType: 'simple',
      hikeSize: 'full',
      hikeLogger: 'none',
      hikeTrackWriter: 'none',
    };
  }

  public render(): any {
    if (this.props.loading) {
      return null;
    }

    const {
      sourceId,
      simulationId,
      simulation: {
        created,
        modified,
        name
      }
    } = this.props;

    const {
      hikeType,
      hikeSize,
      hikeLogger,
      hikeTrackWriter,
    } = this.state;

    return (
      <Form
        name={name}
        created={created}
        modified={modified}
        tag={`${sourceId}:${simulationId}`}
      >
        <Tabs
          hikeContent={
            <Hike
              hikeType={hikeType}
              hikeSize={hikeSize}
              hikeLogger={hikeLogger}
              hikeTrackWriter={hikeTrackWriter}
              onChange={this.handleChange}
            />
          }
          trailsContent={<Trails />}
          hikersContent={(<div>hikers</div>)}
        />
      </Form>
    );
  }

  private handleChange = (event) => {
    // @ts-ignore
    this.setState({ [event.target.name]: event.target.value });
  };
}

export default View;
