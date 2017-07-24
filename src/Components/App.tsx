import * as React from "react";

import { Component } from "react";

import {} from "./Chart";
import { SavedStores } from "./SavedStores";

import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { LoanAccount, Transfer, SampleData } from "../Models/Account";
import { OutputTableContainer } from "./OutputTableContainer";

import { DataSchema, NormalizedEntities } from "../Models/DataSchema";

export class StateObj {
  accounts: LoanAccount[] = [];
  xfers: Transfer[];
}

class AppState {
  normalizedEntities: NormalizedEntities;
}

export class App extends Component<{}, AppState> {
  handleAccountChange = this._handleChangeFactory<LoanAccount>("accounts");
  handleTransferChange = this._handleChangeFactory<Transfer>("xfers");

  constructor(props: {}) {
    super(props);

    // loads a sample data set
    const cashLoanExampleAccts = SampleData.getTypicalExample();

    const defaultAccount = new LoanAccount();
    defaultAccount.id = -1;
    defaultAccount.name = "*thin air*";

    cashLoanExampleAccts.accounts.push(defaultAccount);

    // normalize and put into the state
    const normalizedEntities = DataSchema.normalizeData(cashLoanExampleAccts);

    this.state = {
      normalizedEntities
    };

    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleTransferChange = this.handleTransferChange.bind(this);
    this.handleLoadingStoredState = this.handleLoadingStoredState.bind(this);
  }

  handleLoadingStoredState(normalizedEntities: NormalizedEntities) {
    this.setState({ normalizedEntities });
  }

  _handleChangeFactory<T extends HasId>(arrayName: string) {
    // this is a generic factory for handling top level changes
    // this is not a very elegant approach since it denorms the normalized data
    return (newObj: T, shouldRemove = false) => {
      // take the new object and overwrite the previous one
      console.log("newObj for change", newObj);

      // push this into the entities and renormalize the data
      const newEntities = { ...this.state.normalizedEntities };
      const newGroup: { [id: number]: T } = {};

      let wasFound = false;

      console.log("newEntities", newEntities);

      Object.keys(newEntities[arrayName]).forEach(key => {
        const testItem = newEntities[arrayName][key];

        // add new one or existing
        if (testItem.id === newObj.id) {
          wasFound = true;
          if (!shouldRemove) {
            newGroup[testItem.id] = newObj;
          }
        } else {
          newGroup[testItem.id] = testItem;
        }
      });

      // this will trigger if the key checking above did not find the current item
      if (!wasFound) {
        newGroup[newObj.id] = newObj;
      }

      newEntities[arrayName] = newGroup;

      console.log("final group", newGroup);

      // denorm the data to regenerate that table
      this.handleDataUpdate(newEntities);
    };
  }

  handleDataUpdate(almostNormEntities: NormalizedEntities) {
    // this will denormalize and normalize again to kill the referneces

    const denormData = DataSchema.denormalizeState(almostNormEntities);
    const normalizedEntities = DataSchema.normalizeData(denormData);

    this.setState({ normalizedEntities });
  }

  render() {
    // process the data to denormalize into useful objects
    let accounts: LoanAccount[] = [];
    let transfers: Transfer[] = [];

    const normEntities = this.state.normalizedEntities;
    if (normEntities !== undefined) {
      const denormState = DataSchema.denormalizeState(normEntities);
      accounts = denormState.accounts;
      transfers = denormState.xfers;
    }

    console.log("accounts", accounts);

    return (
      <div>
        <Grid>
          <Row>
            <PageHeader>Finance Forecaster</PageHeader>
          </Row>
          <Row>
            <Col md={12}>
              <SavedStores
                currentAppState={this.state.normalizedEntities}
                handleLoadingStoredState={this.handleLoadingStoredState}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <OutputTableContainer
                accounts={accounts}
                transfers={transfers}
                handleAccountChange={this.handleAccountChange}
                handleTransferChange={this.handleTransferChange}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

interface HasId {
  id: number;
}
