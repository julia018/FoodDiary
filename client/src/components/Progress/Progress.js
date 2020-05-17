import React from "react";
import { add, format, differenceInCalendarDays, isFuture } from "date-fns";
import CustomTooltip from "./CustomTooltip";
import {
	ResponsiveContainer,
	LineChart,
	XAxis,
	YAxis,
	Label,
	Tooltip,
	Line
} from "recharts";

const dateFormatter = date => {
	return format(new Date(date), "dd/MMM/yyyy");
};

class Progress extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAuth: false,
			dataPoints: [
				{ "time": 125646541321564, "weight": 61 },
				{ "time": 184555666665666, "weight": 65 },
				{ "time": 205465666565666, "weight": 70 },
				{ "time": 216231154556455, "weight": 60 },
				{ "time": 256122656656664, "weight": 65 },
				{ "time": 262116644454445, "weight": 71 },
				{ "time": 256122656656664, "weight": 68 },
				{ "time": 256122656656664, "weight": 60 },
				{ "time": 256122658656564, "weight": 66 },
				{ "time": 256122652656664, "weight": 62 },
				{ "time": 256122651656664, "weight": 61 },
				{ "time": 256122656656964, "weight": 68 },
				{ "time": 256122656650664, "weight": 67 },
			]
		};
	}

	gradientOffset() {
		const dataMax = Math.max(...this.state.dataPoints.map((point) => point.weight));
		const dataMin = Math.min(...this.state.dataPoints.map((point) => point.weight));

		if (dataMax <= 80) {
			return 0
		}
		else if (dataMin >= 80) {
			return 1
		}
		else {
			return dataMax / (dataMax - dataMin);
		}
	}





	render() {

		const off = this.gradientOffset();
		return (
			<ResponsiveContainer width={"95%"} height={400}>
				<LineChart
					width={600}
					height={400}
					data={this.state.dataPoints}
					margin={{ top: 100, right: 30, left: 50, bottom: 30 }}
					scale="time"					
					type="number"
				>
					<defs>
						<linearGradient id="weight" x1="0%" y1="100%" x2="0%" y2="0%">
							<stop offset="0%" stopColor="#FF0000" />
							<stop offset="10%" stopColor="#FF4242" />
							<stop offset="20%" stopColor="#FF6666" />
							<stop offset="30%" stopColor="#FF8888" />
							<stop offset="40%" stopColor="#DBFF88" />
							<stop offset="50%" stopColor="#A3FF88" />
							<stop offset="60%" stopColor="#DBFF88" />
							<stop offset="70%" stopColor="#FF8888" />
							<stop offset="80%" stopColor="#FF6666" />
							<stop offset="90%" stopColor="#FF4242" />
							<stop offset="100%" stopColor="#FF0000" />
						</linearGradient>
					</defs>

					<XAxis dataKey="time" domain={["dataMin", "dataMax"]} tickFormatter={dateFormatter}>
						<Label
							value={"Date"}
							position="bottom"
							style={{ textAnchor: "middle" }}
							
						/>
					</XAxis>

					<YAxis>
						<Label
							value={"Weight"}
							position="left"
							angle={-90}
							style={{ textAnchor: "middle" }}
						/>
					</YAxis>
					<Tooltip content={<CustomTooltip />} />
					<Line dataKey="weight"
						name="Weight"
						unit={"kg"}
						dot={false}
						type={"natural"}
						stroke="url(#weight)"
						strokeWidth="2px" />
				</LineChart>
			</ResponsiveContainer>
		);

		
	};

}



export default Progress;