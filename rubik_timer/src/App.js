import React, { Component } from "react";
import "./scss-css/styles.css";
import Timer from "./components/timer.jsx";
import TableTimes from "./components/timeTable.jsx"

const SPACE_KEY = 32;

class App extends Component {
  constructor(){
    super();
    this.state = {
      timerRunning: false,
      times: [] 
    };
  }
  

  componentDidMount(){
    window.addEventListener('keyup', (e) => this.updateTimer(e));
  }

  updateTimer = (e) => {
    if (e.keyCode === SPACE_KEY)
      this.setState((state) => ({timerRunning: !state.timerRunning}))
  }

  addTime = (time) => {
    this.state.times.push(time);
    this.setState({times: this.state.times});
  } 

  render() {
    return (
    <React.Fragment>
      <Timer running={this.state.timerRunning} times={this.state.times} addTime={this.addTime}/>
      <TableTimes times={this.state.times}/>
    </React.Fragment>
    );
  }
}

export default App;
