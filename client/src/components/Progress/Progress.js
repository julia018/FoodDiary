import React from "react";
import {
	ResponsiveContainer,
	LineChart,
	XAxis,
	YAxis,
	Label,
	Tooltip,
	Line
} from "recharts";
class Progress extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAuth: false,
			dataPoints: [
				{ "date": 12, "weight": 61 },
				{ "date": 18, "weight": 65 },
				{ "date": 20, "weight": 70 },
				{ "date": 21, "weight": 60 },
				{ "date": 25, "weight": 65 },
				{ "date": 26, "weight": 71 },
				{ "date": 27, "weight": 75 },
				{ "date": 28, "weight": 60 }
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
			<ResponsiveContainer width={"100%"} height={400}>
				<LineChart
					width={600}
					height={400}
					data={this.state.dataPoints}
					margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
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

					<XAxis type="number" dataKey="date" domain={["dataMin", "dataMax"]}>
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
					<Tooltip />
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