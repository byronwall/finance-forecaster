import * as React from 'react';
import { Component } from 'react';
import { Panel, Button, Glyphicon } from 'react-bootstrap';

import RecurringInput from './RecurringInput';

export default class RecurringInputs extends Component<any, any> {
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
                <Panel header="Recurring Inputs">
                    <form>
                        <table>
                            <thead>
                                <tr>
                                    <th>amount</th>
                                    <th>frequency</th>
                                    <th>start/delay (months)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    inputs.map((inputData: any, index: any) => (
                                        <RecurringInput
                                            input={inputData}
                                            key={inputData.id}
                                            id={inputData.id}
                                            handleChange={this.handleChange}
                                        />
                                    ))
                                }
                                <tr>
                                    <Button onClick={(e) => this.handleChange({ key: 'add' })}>
                                        <Glyphicon glyph="plus" />
                                    </Button>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </Panel>
            </div>
        );
    }
}
