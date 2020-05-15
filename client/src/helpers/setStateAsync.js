export const setStateAsync = (setState) => { //state is an object {example: "Hello"}
  return new Promise((resolve) => {
    //this.setState(state, resolve)
    setState(resolve)
  });
}