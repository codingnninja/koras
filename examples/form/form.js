import { $register, $render } from "../../dist/esm/render.js";
// Step component

function Step({ id, title, content, activeStep = 0, index = 0 } = {}) {
    return `
      <div id="step-${id}" style="display: ${index === activeStep ? 'block' : 'none'};">
        <h3>${title}</h3>
        <div>${content}</div>
      </div>
    `;
  }
  
  // StepperControls component
  function StepperControls({ activeStep = 0, totalSteps = 1 } = {}) {
    function goNext() {
      if (activeStep < totalSteps - 1) $render(FormStepper, { activeStep: activeStep + 1 });
    }
  
    function goPrev() {
      if (activeStep > 0) $render(FormStepper, { activeStep: activeStep - 1 });
    }
  
    function handleSubmit() {
      alert("Form submitted!");
    }
  
    return `
      <div id="steppercontrols">
        <If condition="${activeStep > 0}">
          <button onclick=${goPrev()}>Previous</button>
        </If>
  
        <If condition="${activeStep < totalSteps - 1}">
          <button onclick=${goNext()}>Next</button>
        </If>
    
        <If condition="${activeStep === totalSteps - 1}">
          <button onclick=${handleSubmit()}>Submit</button>
        </If>
      </div>
    `;
  }
  
  // Main FormStepper component
  function FormStepper({ activeStep = 0, steps = [] } = {}) {
    console.log(steps)
    return `
      <section id="formstepper">
        <ul id="step-list">
          ${
            steps && steps.length > 0 ? steps.map(item => `
              <Step {...item} />
            `) : 'No step yet'
          }
        </ul>
  
        <StepperControls activeStep=${activeStep} totalSteps=${steps.length} />
      </section>
    `;
  }
  
  // Example registration
  $register({ FormStepper, Step, StepperControls });
  
  // Example usage
  $render(FormStepper, {
    activeStep: 0,
    steps: [
      { id: 1, title: "Step 1: Info", content: "<input placeholder='Name' />" },
      { id: 2, title: "Step 2: Contact", content: "<input placeholder='Email' />'><script></script>" },
      { id: 3, title: "Step 3: Confirm", content: "<p>Review your info</p>" },
    ],
  });