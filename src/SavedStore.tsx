import * as React from 'react';
import { Component } from "react";
import { ListGroupItem, Glyphicon } from "react-bootstrap";

export default class SavedStore extends Component<any, any> {

    handleChange(e: any, key: string) {
        this.props.handleChange({
            id: this.props.id,
            key
        })

        //this ensure the remove event does not trigger a load event also
        e.stopPropagation();
    }

    render() {
        let input = this.props.input;

        return (
            <ListGroupItem onClick={(e) => { this.handleChange(e, "load") }}>
                <div>
                    {input.name}
                    <Glyphicon glyph="remove" onClick={(e) => { this.handleChange(e, "remove") }} />
                </div>
            </ListGroupItem>
        );
    }
}
