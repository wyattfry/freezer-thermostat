const TEST_TEMP = [-11.5, 11.3];

const INITIAL_STATE = {
  // currentTemp: "(getting data from sensor)",
  currentTemp: TEST_TEMP,
  triggerStart: -11,
  triggerStop: -12,
  status: "(getting data from controller)",
  tempScale: "Celsius"
};

function celsiusToFahrenheit(celsius) {
  return celsius * (9 / 5) + 32;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    console.log("clicked");
    let input = e.target.value;
    switch(input) {
      case "Celsius":
        console.log("clicked c");
        this.setState({ tempScale: "Celsius" });
        break;
      case "Fahrenheit":
        console.log("clicked f");
        this.setState({ tempScale: "Fahrenheit" });
        break;
    }
  }

  render() {
    let { currentTemp, status, tempScale } = this.state;
    
    let displayTemp = currentTemp[0] + "°C";
    if (tempScale === "Fahrenheit") {
      displayTemp = currentTemp[1] + "°F";
    }
    
    return (
      <div className="containercontainer">
        <ScaleToggle 
          handleClick={this.handleClick}
        />
        <Display 
          currentTemp={displayTemp}
          status={status}
        />
      </div>
    );
  }
}

class ScaleToggle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="row justify-content-center mb-4">
			  <div className="btn-group" role="group" aria-label="Basic example">
				  <button type="button" className="btn btn-secondary" value="Celsius" onClick={this.props.handleClick}>Celsius</button>
				  <button type="button" className="btn btn-secondary" value="Fahrenheit" onClick={this.props.handleClick}>Fahrenheit</button>
			  </div>
		  </div>
    );
  }

}

class Display extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { currentTemp, status, tempScale} = this.props;
       
    return (
      <div className="row justify-content-center my-5">
        <div className="col-auto">
          <table className="table table-responsive">
            <tbody>
              <tr><td>Current temperature:</td><td className="text-right" ><span id="temp-span">{currentTemp}</span></td></tr>
              <tr><td>Start cooling trigger temp:</td><td className="text-right">-11°C, 12.2°F</td></tr>
              <tr><td>Stop cooling trigger temp:</td><td className="text-right">-12°C, 10.4°F</td></tr>
              <tr><td>Current state:</td><td className="text-right" ><span id="state-span">{status}</span></td></tr>
            </tbody>
          </table>
        </div>
		  </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById("root"));