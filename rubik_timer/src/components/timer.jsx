import React, { Component } from "react";
import Avg from "./avg.jsx";
import {convertSec, displayTime} from "./utilities.jsx";

export default class Timer extends Component {
	constructor(props) {
		super(props);

		//times stored in seconds
		this.state = { min: 0, sec: 0, msec: 0, running: this.props.running, times: this.props.times};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.running !== this.props.running) {
			if (prevProps.running) {
				let newTime = this.stop();
				this.props.addTime(newTime);
				this.setState({times: this.props.times});
			} else {
				this.setState({min: 0, sec: 0, msec: 0});
				this.increment();
			}
		}
	}

	increment = () => {
   		this.timerID = setInterval(this.incrementHelper, 10);
	}

	incrementHelper = () => {
    	if (this.state.msec < 99)
    		this.setState(state => ({ msec: state.msec + 1 }));
    	else if (this.state.sec < 59)
     		this.setState(state => ({ sec: state.sec + 1, msec: 0 }));
    	else
      		this.setState(state => ({ min: state.min + 1, sec: 0, msec: 0 }));

	}

	stop = () => {
		clearInterval(this.timerID);
		let {min, sec, msec} = this.state;
		let secTime = convertSec(min, sec, msec);
		return secTime;
	}

	render() {    
		return (
			<React.Fragment>
				<h1 className="timer">{displayTime(this.state.min, this.state.sec, this.state.msec)}</h1>
				<Avg times={this.state.times}/>
			</React.Fragment>
		);
	}
}