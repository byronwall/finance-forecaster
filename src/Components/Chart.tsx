import * as React from "react";
import { Component } from "react";
import {} from "react-bootstrap";

import {
  Line,
  LineChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  YAxis
} from "recharts";
import { LoanCashFlow } from "../Models/Account";

interface ChartProps {
  data: LoanCashFlow[];
}

export class Chart extends Component<ChartProps> {
  render() {
    return (
      <div>
        <LineChart
          width={400}
          height={400}
          data={this.props.data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid />
          <Line type="monotone" dataKey="balance" />
          <Line type="monotone" dataKey="payments" />
          
        </LineChart>
      </div>
    );
  }
}
