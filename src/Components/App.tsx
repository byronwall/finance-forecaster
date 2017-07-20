import * as React from "react";
import * as store from "store";
import * as CryptoJS from "crypto-js";

import { Component } from "react";

import {} from "./Chart";
import { SavedStores } from "./SavedStores";

import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { LoanAccount, Transfer, SampleData } from "../Models/Account";
import { OutputTableContainer } from "./OutputTableContainer";

import { DataSchema, NormalizedEntities } from "../Models/DataSchema";

export class StateObj {
  accounts: LoanAccount[] = [];
  transfers: Transfer[];
}

class SavedState {
  name: string;
  data: StateObj;
  encryptedData: CryptoJS.WordArray | string;
  encrytedCheck: CryptoJS.WordArray | string;
}

class AppState {
  normalizedEntities: NormalizedEntities;
  savedObj: SavedState[];
}

export class App extends Component<{}, AppState> {
  handleAccountChange = this._handleChangeFactory<LoanAccount>("accounts");

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
      normalizedEntities,
      savedObj: this.getSavedObj()
    };

    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
  }

  getSavedObj() {
    return store.get("savedState") || [];
  }

  handleStoreChange(obj: any) {
    // TODO: move this out of the App class
    console.log("handleStoreChange", obj);

    if (obj.key === "remove") {
      // this will remove the given item

      let savedObj = this.state.savedObj;

      savedObj = savedObj.filter((el: any) => {
        return el.name !== obj.id;
      });

      console.log("new savedObj", savedObj);

      this.setState({ savedObj });
      store.set("savedState", savedObj);
    } else if (obj.key === "save") {
      console.log("saving the state");

      // take the current state (excluding the saved state obj)
      let savedState = new StateObj();
      for (let key of Object.keys(savedState)) {
        savedState[key] = this.state[key];
      }

      let saveName = window.prompt("Enter a name for saving") || "";

      let saveData = new SavedState();
      saveData.name = saveName;

      let passphrase =
        window.prompt("Enter a passphrase or blank for no encryption") || "";

      let isEncrypted = passphrase !== "";

      if (isEncrypted) {
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(savedState),
          passphrase
        );

        const encryptedCheck = CryptoJS.AES.encrypt("true", passphrase);

        saveData.encryptedData = encryptedData.toString();
        saveData.encrytedCheck = encryptedCheck.toString();
      } else {
        saveData.data = savedState;
      }

      console.log("save data", saveData);

      // add to existing objects
      let savedObj = [...this.state.savedObj, saveData];

      store.set("savedState", savedObj);

      this.setState({ savedObj: savedObj });
      // put that object into a store
    } else if (obj.key === "load") {
      // iterate through the saved ones for the id
      console.log("loading the saved state");
      let stateToLoad = this.state.savedObj.find(
        item => item.name === obj.id
      ) as SavedState;

      // check for encryption

      let shouldLoad = true;

      if (stateToLoad.encryptedData !== "") {
        const passphrase = window.prompt("Please enter the passphrase") || "";

        // check is passphrase is OK
        const encryptedCheck = CryptoJS.AES
          .decrypt(stateToLoad.encrytedCheck, passphrase)
          .toString(CryptoJS.enc.Utf8);

        if (encryptedCheck === "true") {
          stateToLoad.data = JSON.parse(
            CryptoJS.AES
              .decrypt(stateToLoad.encryptedData, passphrase)
              .toString(CryptoJS.enc.Utf8)
          );
        } else {
          shouldLoad = false;
          alert("passphrase was wrong... will not load");
        }
      }

      if (shouldLoad) {
        // TODO: resolve this error
        //stateToLoad.data = StateObj.FromJson(stateToLoad.data);
        // this.setState({ ...stateToLoad.data });
      }

      // push that data into the current state
    }
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
    // test the normalization

    // process the data to denormalize into useful objects
    let accounts: LoanAccount[] = [];

    const normEntities = this.state.normalizedEntities;

    if (this.state.normalizedEntities !== undefined) {
      accounts = DataSchema.denormalizeState(normEntities).accounts;
    }

    return (
      <div>
        <Grid>
          <Row>
            <PageHeader>Finance Forecaster</PageHeader>
          </Row>
          <Row>
            <Col md={12}>
              <SavedStores
                inputs={this.state.savedObj}
                handleChange={this.handleStoreChange}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <OutputTableContainer
                accounts={accounts}
                handleAccountChange={this.handleAccountChange}
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
