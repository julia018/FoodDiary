import React from "react";
import 'rc-slider/assets/index.css';
import "../../static/styles/slider.css";
import SliderElement from 'rc-slider';
const createSliderWithTooltip = SliderElement.createSliderWithTooltip;
const Slider = createSliderWithTooltip(SliderElement);


class CalorieSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 1,
      max: 2000,
      step: 10,
      value: 50,
      disabled: true ,
      marks: {}  
    };
  }

  configureSlider = (value, step, min, max, marks) => {
    this.setState({value, step, min, max, marks});
  }

  setNull= () => {
    this.value = undefined;
    this.setState({marks: {}});
  }

  changeDisabled = (disabled) => {
    console.log("Change disable" + disabled);
    this.setState({disabled});
  }

  getValue = () => {
    return this.state.value
  }

  onSliderChange = (value) => {
    this.setState({value});
  }
  render() {
    
    return (
      <Slider value={this.state.value} min={this.state.min} max={this.state.max} step={this.state.step}
          onChange={this.onSliderChange} disabled={this.state.disabled} marks={this.state.marks} className={"slider"}
          tipProps={{
          placement:'top',
          prefixCls: 'rc-slider-tooltip'
          }} 
        />
    )
  }
}

export default CalorieSlider;