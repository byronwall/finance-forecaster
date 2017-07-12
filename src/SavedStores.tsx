import * as React from 'react';
import { Component } from 'react';
import { Panel, ListGroup, Button } from 'react-bootstrap';

import SavedStore from './SavedStore';

export default class SavedStores extends Component<any, any> {
    constructor(props: any) {
        super(props);

        // this is required in order to use this correct in the event handler
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(obj: any) {
        // this will just pass the event through
        this.props.handleChange(obj);
    }

    render() {

        let inputs = this.props.inputs;

        return (
            <div>
                <Panel header="Saved Stores">
                    <ListGroup >
                        {
                            inputs.map((input: any) => (
                                <SavedStore
                                    input={input}
                                    handleChange={this.handleChange}
                                    key={input.name}
                                    id={input.name} />
                            ))
                        }
                    </ListGroup>
                    <Button onClick={(e) => { this.handleChange({ key: 'save' }); }}>
                        <p>save current</p>
                    </Button>
                </Panel>
            </div>
        );
    }
}
