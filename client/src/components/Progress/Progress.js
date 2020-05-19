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
				{ date: 1589576400100, weight: 61 },
				{ date: 1589576400000, weight: 65 }
			]
		};
	}

	async componentDidMount() {
		const res = await fetch("/weight/progress", { method: "POST" });
		const weightsByDates = await res.json();
		console.log(weightsByDates)
		this.setState({dataPoints: weightsByDates})
	  }

	render() {

		return (
			<ResponsiveContainer width={"95%"} height={400}>
				<LineChart
					width={600}
					height={400}
					data={this.state.dataPoints.slice()}
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

					<XAxis dataKey="date" domain={["dataMin", "dataMax"]} tickFormatter={dateFormatter}>
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