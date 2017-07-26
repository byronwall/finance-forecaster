import * as React from "react";
import { Component } from "react";
import { FormControl } from "react-bootstrap";

interface ClickEditableProps {
  value: string;
  handleValueChange?(newValue: string): void;
  handleNumericChange?(newNumber: number): void;
}

interface ClickEditableState {
  newValue: string;
  isEditing: boolean;
}

export class ClickEditable extends Component<
  ClickEditableProps,
  ClickEditableState
> {
  constructor(props: ClickEditableProps) {
    super(props);

    this.state = {
      newValue: this.props.value,
      isEditing: false
    };
  }

  handleEditChange(value: string) {
    value = value.replace("\u00a0", "");

    this.setState({
      newValue: value
    });
  }

  handleEdit() {
    this.setState({ isEditing: true });
  }

  handleSave() {
    if (this.props.handleValueChange !== undefined) {
      this.props.handleValueChange(this.state.newValue);
    }
    if (this.props.handleNumericChange !== undefined) {
      const trimVal = this.state.newValue.trim();

      const newNumber = trimVal === "" ? 0 : Number.parseFloat(trimVal);

      this.props.handleNumericChange(newNumber);
    }

    this.setState({ isEditing: false });
  }

  handleCancel() {
    this.setState({
      isEditing: false,
      newValue: this.props.value
    });
  }

  handleKeyDown(event: any) {
    console.log(event);

    switch (event.key) {
      case "Enter":
        this.handleSave();
        break;
      case "Escape":
        this.handleCancel();
        break;
      default:
        break;
    }
  }

  render() {
    const value = this.state.newValue;

    const viewBlock = (
      <div onClick={() => this.handleEdit()}>
        {this.props.value}
      </div>
    );

    const editBlock = (
      <FormControl
        autoFocus={true}
        type="text"
        value={value}
        onChange={(e: any) => this.handleEditChange(e.target.value)}
        onKeyDown={(e: any) => this.handleKeyDown(e)}
        onBlur={() => this.handleCancel()}
      />
    );

    const renderBlock = this.state.isEditing ? editBlock : viewBlock;

    return renderBlock;
  }
}
