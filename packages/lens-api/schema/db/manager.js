import uuid from 'uuid/v1';
import _ from 'highland';

import _debug from 'debug';
const debug = _debug('lens:api-manager');

class Manager {
  constructor(db, dbOptions, indexOptions) {
    this.db = db;
    this.dbOptions = dbOptions;
    this.indexOptions = indexOptions;
  }

  addSimulation({ id, sourceId, created, ...other }) {
    const key = id || uuid();
    const createdOn = created || Date.now();
    const simulation = {
      ...other,
      id: key,
      sourceId,
      created: createdOn,
      modified: createdOn,
    };
    return this.db.simulations.put(key, simulation)
      .then(() => this.db.simulationsSourceIdx.put([sourceId, key], key))
      .then(() => simulation);
  }

  getSimulation(id) {
    return this.db.simulations.get(id)
      .then(simulation => {
        return this.getExecutions(simulation.id)
          .then(executions => ({
            ...simulation,
            executions,
            executionsCount: executions.length,
          }));
      })
      .catch(err => {
        debug('getSimulation', err.toString());
      });
  }

  getSimulationIndex(sourceId, simulationId) {
    return this.db.simulationsSourceIdx.get([sourceId, simulationId])
      .catch(err => {
        debug('getSimulationIndex', err.toString());
      });
  }

  addExecutionsToSimulationStreamItem(err, simulation, push, next) {
    if (err) {
      push(err);
      next();
    } else if (simulation === _.nil) {
      push(null, simulation);
    } else {
      debug('addExecutionsToSimulationStreamItem', { simulation });
      this.getExecutions(simulation.id, rows => {
        debug(' - adding simulation rows', { rows });
        simulation.executions = rows;
        simulation.executionsCount = rows.length;
        push(null, simulation);
        next();
      });
    }
  }

  getSimulationsStream(deep = true) {
    const query = { ...this.dbOptions };
    const simulationStream = this.db.simulations.createValueStream(query);
    return deep
      ? _(simulationStream).consume(this.addExecutionsToSimulationStreamItem.bind(this))
      : _(simulationStream);
  }

  getSimulationsForSourceStream(sourceId, deep = true) {
    const query = {
      ...this.indexOptions,
      gte: [sourceId],
      lt: [sourceId, '\xff'],
    };
    const simulationIndexStream = this.db.simulationsSourceIdx.createValueStream(query);
    const getSimulationStream = _.wrapCallback(this.db.simulations.get.bind(this.db.simulations));
    const simulationsStream = _(simulationIndexStream).flatMap(getSimulationStream);
    return deep
      ? simulationsStream.consume(this.addExecutionsToSimulationStreamItem.bind(this))
      : simulationsStream;
  }

  getSimulations(cb) {
    debug('getSimulations', { cb });
    return cb
      ? this.getSimulationsStream().toArray(cb)
      : this.getSimulationsStream().collect().toPromise(Promise);
  }

  getSimulationsForSource(sourceId, cb) {
    debug('getSimulationsForSource', { sourceId, cb });
    return cb
      ? this.getSimulationsForSourceStream(sourceId).toArray(cb)
      : this.getSimulationsForSourceStream(sourceId).collect().toPromise(Promise);
  }

  updateSimulation(id, changes) {
    const modified = Date.now();
    return this.getSimulation(id)
      .then(simulation => {
        const newSimulation = {
          ...simulation,
          ...changes,
          modified,
        };
        return this.db.simulations.put(id, newSimulation)
          .then(() => newSimulation);
      });
  }

  addExecution({ id, simulationId, created, ...other }) {
    const key = id || uuid();
    const createdOn = created || Date.now();
    const execution = {
      ...other,
      id: key,
      simulationId,
      created: createdOn,
      modified: createdOn,
    };
    return this.db.executions.put(key, execution)
      .then(() => this.db.executionsSimulationIdx.put([simulationId, key], key))
      .then(() => execution);
  }

  getExecution(id) {
    return this.db.executions.get(id)
      .then(execution => {
        return this.getRenderings(execution.id)
          .then(renderings => ({
            ...execution,
            renderings,
            renderingsCount: renderings.length,
          }));
      })
      .catch(err => {
        debug('getExecution', err.toString());
      });
  }

  getExecutionIndex(simulationId, executionId) {
    return this.db.executionsSimulationIdx.get([simulationId, executionId])
      .catch(err => {
        debug('getExecutionIndex', err.toString());
      });
  }

  addRenderingsToExecutionStreamItem(err, execution, push, next) {
    if (err) {
      push(err);
      next();
    } else if (execution === _.nil) {
      push(null, execution);
    } else {
      debug('addRenderingsToExecutionStreamItem', { execution });
      this.getRenderings(execution.id, rows => {
        debug(' - adding rendering rows', { rows });
        execution.renderings = rows;
        execution.renderingsCount = rows.length;
        push(null, execution);
        next();
      });
    }
  }

  getExecutionsStream(simulationId, deep = true) {
    const query = {
      ...this.indexOptions,
      gte: [simulationId],
      lt: [simulationId, '\xff'],
    };
    const executionIndexStream = this.db.executionsSimulationIdx.createValueStream(query);
    const getExecutionStream = _.wrapCallback(this.db.executions.get.bind(this.db.executions));
    const executionStream = _(executionIndexStream).flatMap(getExecutionStream);
    return deep
      ? executionStream.consume(this.addRenderingsToExecutionStreamItem.bind(this))
      : executionStream;
  }

  getExecutions(simulationId, cb) {
    debug('getExecutions', { simulationId, cb });
    return cb
      ? this.getExecutionsStream(simulationId).toArray(cb)
      : this.getExecutionsStream(simulationId).collect().toPromise(Promise);
  }

  deleteExecution(id) {
    return this.getRenderings(id)
      .then(rows => Promise.all([
        this.db.renderingsExecutionIdx.batch(rows.map((rendering) => ({
          type: 'del',
          key: [id, rendering.id],
        }))),
        this.db.renderings.batch(rows.map((rendering) => ({
          type: 'del',
          key: rendering.id,
        }))),
      ]))
      .then(() => this.db.executions.get(id))
      .then(exe => Promise.all([
        this.db.executionsSimulationIdx.del([exe.simulationId, exe.id]),
        this.db.executions.del(exe.id),
      ]))
      .catch(err => {
        debug('deleteExecution', err.toString());
        throw err;
      });
  }

  updateExecution(id, changes) {
    const modified = Date.now();
    return this.getExecution(id)
      .then(execution => {
        const newExecution = {
          ...execution,
          ...changes,
          modified,
        };
        return this.db.executions.put(id, newExecution)
          .then(() => newExecution);
      });
  }

  addRendering({ id, executionId, created, ...other }) {
    const key = id || uuid();
    const createdOn = created || Date.now();
    const rendering = {
      ...other,
      id: key,
      executionId,
      created: createdOn,
      modified: createdOn,
    };
    return this.db.renderings.put(key, rendering)
      .then(() => this.db.renderingsExecutionIdx.put([executionId, key], key))
      .then(() => rendering);
  }

  getRendering(id) {
    return this.db.renderings.get(id)
      .catch(err => {
        debug('getRendering', err.toString());
      });
  }

  getRenderingIndex(executionId, renderingId) {
    return this.db.renderingsExecutionIdx.get([executionId, renderingId])
      .catch(err => {
        debug('getRenderingIndex', err.toString());
      });
  }

  getRenderingsStream(executionId) {
    const query = {
      ...this.indexOptions,
      gte: [executionId],
      lt: [executionId, '\xff'],
    };
    const renderingIndexStream = this.db.renderingsExecutionIdx.createValueStream(query);
    const getRenderingStream = _.wrapCallback(this.db.renderings.get.bind(this.db.renderings));
    return _(renderingIndexStream).flatMap(getRenderingStream);
  }

  getRenderings(executionId, cb) {
    debug('getRenderings', { executionId, cb });
    return cb
      ? this.getRenderingsStream(executionId).toArray(cb)
      : this.getRenderingsStream(executionId).collect().toPromise(Promise);
  }

  updateRendering(id, changes) {
    const modified = Date.now();
    return this.getRendering(id)
      .then(rendering => {
        const newRendering = {
          ...rendering,
          ...changes,
          modified,
        };
        return this.db.renderings.put(id, newRendering)
          .then(() => newRendering);
      });
  }

  deleteRendering(id) {
    return this.db.renderings.get(id)
      .then(ren => Promise.all([
        this.db.renderingsExecutionIdx.del([ren.executionId, id]),
        this.db.renderings.del(id),
      ]))
      .catch(err => {
        debug('deleteRendering', err.toString());
        throw err;
      });
  }

  deleteSimulation(id) {
    return this.getExecutionsStream(id, false).collect().toPromise(Promise)
      .then(executions => Promise.all(executions.map(execution => this.deleteExecution(execution.id))))
      .then(() => this.db.simulations.get(id))
      .then(simulation => Promise.all([
        this.db.simulationsSourceIdx.del([simulation.sourceId, simulation.id]),
        this.db.simulations.del(id),
      ]))
      .catch(err => {
        debug('deleteSimulation', err.toString());
        throw err;
      });
  }
}

export default Manager;
