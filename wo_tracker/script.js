const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJvuxYcDG7NzxMT5L3CqwjfAMqAtc0rjIIyLhpscJsCgl-FrCBd1vwbpmccim1rDfA/exec"; // must end with /exec

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("wo_tracker");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Build a plain object of all fields
    const fd = new FormData(form);
    const payload = {};
    for (const [key, value] of fd.entries()) {
      // Convert numeric strings to numbers when possible (optional)
      // Keep blanks as "" so columns stay aligned
      if (value === "") {
        payload[key] = "";
      } else if (!isNaN(value) && value.trim() !== "") {
        payload[key] = Number(value);
      } else {
        payload[key] = value;
      }
    }

    // Add a date/time stamp (ISO). You can also format it differently.
    payload.date = new Date().toISOString();

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      const text = await res.text();

      if (!res.ok || !text.toLowerCase().includes("success")) {
        console.error("Server response:", text);
        alert("Error saving: " + text);
        return;
      }

      alert("Saved!");
      // Optional: clear only the number inputs, keep hidden fields
      form.querySelectorAll('input[type="number"]').forEach((i) => (i.value = ""));
    } catch (err) {
      console.error(err);
      alert("Error saving (network): " + err.message);
    }
  });
});
