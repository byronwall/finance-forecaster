import * as React from "react";
import { Component } from "react";
import {} from "react-bootstrap";

import {
  Line,
  LineChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  YAxis,
  ResponsiveContainer
} from "recharts";
import { LoanCashFlow } from "../Models/Account";

interface ChartProps {
  data: LoanCashFlow[];
}

export class Chart extends Component<ChartProps> {
  render() {
    return (
      <div>
        <ResponsiveContainer height={400}>
          <LineChart
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
        </ResponsiveContainer>
      </div>
    );
  }
}
