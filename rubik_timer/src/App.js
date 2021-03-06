import React, { Component } from "react";
import "./scss-css/styles.css";
import Timer from "./components/timer.jsx";
import TableTimes from "./components/timeTable.jsx";
import Graph from "./components/graph.jsx";
import ScrambleGen from "./components/scrambleGen.jsx";
import SettingsButton from "./components/settings.jsx";
import HelpButton from "./components/help.jsx";
import { withFirebase } from "./components/firebase/firebaseIndex";
import { isMobile } from 'react-device-detect';
import axios from "axios";
import { IP, setIP } from "./globals.js";

const SPACE_KEY = 32;

class AppBase extends Component {
  /*
  * times are stored in reverse order (most recent first then oldest times after)
  * scrambles and dates are stored in true order (oldest first then most recent after)
  * display used to determine whether or not to show the graph + time table
  */
  
  constructor(props){
    super(props);
    this.state = {
      timerRunning: false,
      timerPrepare: false,
      times: [], 
      scrambles: [],
      dates: [],
      display: {graph: true, table: true}
    };

    this.timerBoxRef = React.createRef();
  }
  
  componentDidMount(){
    if (!isMobile) {
      window.addEventListener('keyup', (e) => this.updateTimer(e));
      window.addEventListener('keydown', (e) => this.flashTimer(e));
    } else {
      window.addEventListener('touchend', (e) => this.updateTimer(e));
      window.addEventListener('touchstart', (e) => this.flashTimer(e));
    }
    //get ip to register user
    this.setUp();
  }

  componentWillUnmount(){
    if (!isMobile) {
      window.removeEventListener('keyup', (e) => this.updateTimer(e));
      window.removeEventListener('keydown', (e) => this.flashTimer(e));
    } else {
      window.removeEventListener('touchend', (e) => this.updateTimer(e));
      window.removeEventListener('touchstart', (e) => this.flashTimer(e));
    }
  }
  
  setUp = () => {
    axios.get("https://api.ipify.org/?format=json")
    .then((response) => {
      setIP(response.data.ip);
      this.props.firebase.getData(IP, this.setTimes, this.setScrambles, this.setDates); //populate times array from db values
    }).catch((err) => {
      console.log(err);
    });   
  }

  setTimes = (t) => {
    if (!t) return;
    this.setState({ times: t });
  }

  setScrambles = (s) => {
    if (!s) return;
    //add the values of current scrambles to the scrambles from db
    Array.prototype.push.apply(s, this.state.scrambles);
    this.setState({ scrambles: s });
  }

  setDates = (d) => {
    if (!d) return;
    //add the values of current scrambles to the scrambles from db
    this.setState({ dates: d });
  }

  updateTimer = (e) => {
    if (e.keyCode === SPACE_KEY || (isMobile && this.timerBoxRef.current.contains(e.target))) 
      this.setState(state => ({timerRunning: !state.timerRunning, timerPrepare: false}));
  }
  
  flashTimer = (e) => {
    if (e.keyCode === SPACE_KEY || (isMobile && this.timerBoxRef.current.contains(e.target)))
      this.setState({timerPrepare: true});
  }

  addTime = (time) => {
    this.state.times.unshift(time);
    this.setState({times: this.state.times});
  } 

  addScramble = (scramble) => {
    this.state.scrambles.push(scramble);
    this.setState({scrambles: this.state.scrambles});
  } 

  addDate = (date) => {
    this.state.dates.push(date);
    this.setState({dates: this.state.dates});
  } 

  setDisplay = (comp, state) => {
    let displayObj = this.state.display;
    //component doesn't exist
    if (!(comp in displayObj))
      return null;
    
    displayObj[comp] = state;
    this.setState({display: displayObj});
  }

  render() {
    return (
    <React.Fragment>
      <div className="button-wrapper">
        <HelpButton/>
        <SettingsButton showTable={this.state.display['table']} showGraph={this.state.display['graph']} 
        setDisplay={this.setDisplay}/> 
      </div>
      <div className="main">
        <div className={"main-container" + (this.state.display['table'] ? "" : " full-width")}>
          <div ref={this.timerBoxRef}>
            <Timer running={this.state.timerRunning} prepare = {this.state.timerPrepare} 
                  times={this.state.times} addTime={this.addTime} scrambles={this.state.scrambles}
                  dates={this.state.dates} addDate={this.addDate}/>
            <ScrambleGen update={this.state.timerRunning} addScramble={this.addScramble}/>
          </div>
        </div>
      </div>
      <TableTimes display={this.state.display['table']} times={this.state.times} 
      displayGraph={this.state.display['graph']} dates={this.state.dates} scrambles={this.state.scrambles}/>
      <Graph display={this.state.display['graph']} times={this.state.times}/>
    </React.Fragment>
    );
  }
}

const App = withFirebase(AppBase);

export default App;

