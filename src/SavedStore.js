import React, { Component } from "react";
import { ListGroupItem, Glyphicon } from "react-bootstrap";

export default class SavedStore extends Component {

    handleChange(e, key) {
        this.props.handleChange({
            id: this.props.id,
            key
        })

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
