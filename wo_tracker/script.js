// ------- Only display numeric keyboard -------
document.addEventListener("DOMContentLoaded", () => {
  const numericInputs = document.querySelectorAll(".num-input");

  numericInputs.forEach(input => {
    // Set input attributes based on name
    const isWeight = input.name.includes('_w');
    const isReps = input.name.includes('_r');

    if (isWeight) {
      input.setAttribute("inputmode", "decimal");
      input.setAttribute("step", "0.1");
    }

    if (isReps) {
      input.setAttribute("inputmode", "numeric");
      input.setAttribute("pattern", "[0-9]*");
    }

    input.setAttribute("min", "0");
  });
});







let currentStep = 0;

function nextStep() {
  const steps = document.querySelectorAll('.step');
  if (currentStep < steps.length - 1) {
    steps[currentStep].style.display = 'none';
    currentStep++;
    steps[currentStep].style.display = 'block';
  }
}





// Format internal input names into spreadsheet labels
function formatExerciseLabel(raw) {
  const map = {
    pushups: "Pushups",
    dbfly: "DB Flyes",
    tripull: "Tri Pulldown",
    inclinepress: "Incline DB Press",
    hexpress: "DB Hex Press",
    dbkick: "DB Kickback",
    latraise: "Lat Raises",
    bentoverfly: "Bent Over Reverse Flyes",
    rollup1: "Rollup (front/back)",
    twist1: "Twist",
    platehold1: "Plate Hold",
    latpulldown: "Lat Pulldown",
    dbrow: "DB Row",
    cablecrunch: "Cable Crunch",
    invertrow: "Inverted Row",
    seatedcurl: "Seated Curl",
    seatcabpull: "Seated Cable Pull",
    shrug: "Shrugs",
    hammercurl: "Hammer Curl",
    deadhang: "Dead Hang",
    abwheel: "Ab Wheel",
    rollup2: "Rollup (front/back)",
    dbsquat: "DB Squat",
    platehold2: "Plate Hold",
    gobletsquat: "Goblet Squat",
    rollup3: "Rollup (front/back)",
    dbstepup: "DB Step Up",
    twist2: "Twist",
    rdl: "RDL",
    standcalfraise: "Standing Calf Raises",
    lungefore: "Lunges (forward)",
    lungeback: "Lunges (backward)",
    dbhamcurl: "DB Ham Curl",
    seatcalfraise: "Seated Calf Raises",
  };
  return map[raw] || raw; // Fallback to original name
}







function submitWorkout() {
  const inputs = document.querySelectorAll('input.num-input');
  const workoutData = {}; // { pushups: [{w,r}, {w,r}, {w,r}], ... }

  // Group inputs by exercise
  inputs.forEach(input => {
    const [name, type] = input.name.split('_'); // e.g., pushups_w1
    const setNum = parseInt(input.name.match(/\d+$/)[0]) - 1;

    if (!workoutData[name]) {
      workoutData[name] = [{}, {}, {}];
    }

    if (input.name.includes('_w')) {
      workoutData[name][setNum].weight = parseFloat(input.value) || 0;
    } else if (input.name.includes('_r')) {
      workoutData[name][setNum].reps = parseInt(input.value) || 0;
    }
  });

  const flatRow = [new Date().toLocaleDateString('en-CA')];

  for (const exercise in workoutData) {
    flatRow.push(formatExerciseLabel(exercise));
    workoutData[exercise].forEach(set => {
      flatRow.push(set.weight || 0);
      flatRow.push(set.reps || 0);
    });
  }

  // Submit to Google Apps Script
  fetch('https://script.google.com/macros/s/AKfycbyp-_Ggpy0s1SQjsGde_yhpMi9tEfdXtq5UegT4hpGfPbjEQxcuIiWdiJb6ZV5TsJ6K/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flatRow)
  });

  document.getElementById('submit-status').textContent = '✅ Workout submitted!';
}
