  const submitForm = async (
    e, // event 
    method = "POST",
    action = "/",
    headers = { 'Content-Type': 'application/json'},
    redirect = false, // If desired then redirect. 
    redirectLocation = "", // Location or address to redirect to.
    history = [], // React Router props.history[].
    state = {}, // State to send. 
    updateErrors = () => {}, // Prop from top component.
    updateState = (result) => {} // Custom implementation to update your state.
    ) => {
    
      if(typeof(e) !== "undefined") e.preventDefault();

    try {

      const res = await fetch(action, {
        method,
        headers,
        body: JSON.stringify({ ...state })
      });
      const result = await res.json();
      if(typeof(result.errors) !== "undefined") {
        updateErrors(result.errors);
        setTimeout(() => updateErrors([]), 2000);
      } else {
        updateState(result);
        if(redirect) return history.push(redirectLocation);
      } 

    } catch(e) {
        console.log(e.message);
        updateErrors(["Failed to submit form."]);
        setTimeout( () => updateErrors([]), 2000);
        return;
    }
  }

  export default submitForm;