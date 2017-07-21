import * as React from "react";
import { Component } from "react";

import * as store from "store";
import * as CryptoJS from "crypto-js";

import {
  Panel,
  ListGroup,
  Button,
  ListGroupItem,
  Glyphicon
} from "react-bootstrap";

import { NormalizedEntities } from "../Models/DataSchema";

interface SavedStoresProps {
  currentAppState: NormalizedEntities;
  handleLoadingStoredState(normEntities: NormalizedEntities): void;
}

interface SavedStoreState {
  savedStates: SavedState[];
}

export class SavedState {
  name: string;
  data: NormalizedEntities | undefined;
  encryptedData: string;
  encrytedCheck: string;
}

export class SavedStores extends Component<SavedStoresProps, SavedStoreState> {
  constructor(props: SavedStoresProps) {
    super(props);

    this.state = {
      savedStates: []
    };
  }

  componentDidMount() {
    this.setState({
      savedStates: store.get("savedState") || []
    });
  }

  handleChange(newObj: SavedState, shouldRemove: boolean = false) {
    // this will update the saved state object and push it back into the store

    // take the new object and overwrite the previous one
    console.log("newObj for saved state", newObj);

    // push this into the entities and renormalize the data
    const newEntities: SavedState[] = [];

    let wasFound = false;

    this.state.savedStates.forEach((savedState, index) => {
      // add new one or existing
      if (savedState.name === newObj.name) {
        wasFound = true;
        if (!shouldRemove) {
          newEntities[index] = newObj;
        }
      } else {
        newEntities[index] = savedState;
      }
    });

    // this will trigger if the key checking above did not find the current item
    if (!wasFound) {
      newEntities.push(newObj);
    }

    // do a set state
    this.setState({ savedStates: newEntities });

    // persist to Store
    store.set("savedState", newEntities);
  }

  handleLoadingState(stateObj: SavedState) {
    // deal with the encryption here
    // iterate through the saved ones for the id
    console.log("loading the saved state");

    let stateToLoad = this.state.savedStates.find(
      item => item.name === stateObj.name
    )!;

    // check for encryption
    let shouldLoad = true;

    if (stateToLoad.encryptedData !== undefined) {
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
        // TODO: provide a better notification than alert
        alert("passphrase was wrong... will not load");
      }
    }

    if (shouldLoad) {
      this.props.handleLoadingStoredState(stateToLoad.data!);
    }
  }

  handleSavingState() {
    const stateObj = this.props.currentAppState;

    console.log("saving the current state", stateObj);

    // TODO: put this in the interface down below
    let saveName = window.prompt("Enter a name for saving") || "";

    let saveData = new SavedState();
    saveData.name = saveName;

    // TODO: move this to the interface below
    let passphrase =
      window.prompt("Enter a passphrase or blank for no encryption") || "";

    let isEncrypted = passphrase !== "";

    if (isEncrypted) {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(stateObj),
        passphrase
      );

      // this check exists to ensrue that the passphrase was correct without loading corrupted data
      const encryptedCheck = CryptoJS.AES.encrypt("true", passphrase);

      saveData.encryptedData = encryptedData.toString();
      saveData.encrytedCheck = encryptedCheck.toString();
    } else {
      saveData.data = stateObj;
    }

    console.log("save data", saveData);

    this.handleChange(saveData);
  }

  render() {
    const states = this.state.savedStates;

    return (
      <div>
        <Panel header="Saved Stores">
          <ListGroup>
            {states.map(state =>
              <ListGroupItem
                key={state.name}
                onClick={() => this.handleLoadingState(state)}
              >
                {state.encryptedData !== undefined &&
                  <Glyphicon glyph="lock" />}
                {state.name}
                <Button
                  bsStyle="danger"
                  bsSize="small"
                  className="pull-right"
                  onClick={(e: React.SyntheticEvent<any>) => {
                    e.stopPropagation();
                    this.handleChange(state, true);
                  }}
                >
                  <Glyphicon glyph="remove" />
                </Button>
              </ListGroupItem>
            )}
          </ListGroup>
          <Button onClick={() => this.handleSavingState()}>
            {"save current"}
          </Button>
        </Panel>
      </div>
    );
  }
}
