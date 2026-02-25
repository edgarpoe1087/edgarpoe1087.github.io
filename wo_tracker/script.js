const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxGGsMncKNaH_5mUZnHA2v2vQQXZdnXhC2N4i4XSutWBaPIQnM5wi5bZ-SEzO9E8-p2/exec";
const CLEAR_AFTER_SUBMIT = true;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("wo_tracker");
  if (!form) return;

  const status = document.createElement("div");
  status.style.marginTop = "12px";
  form.appendChild(status);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    setStatus(status, "Submitting...", "info");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const payload = formToObject(form);

      // Add timestamps
      const now = new Date();
      payload.date = now.toISOString().slice(0, 10);      // YYYY-MM-DD
      payload.timestamp = now.toISOString();              // ISO

      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

      setStatus(status, "Saved ✅", "success");

      if (CLEAR_AFTER_SUBMIT) {
        form.querySelectorAll('input[type="number"]').forEach(i => (i.value = ""));
      }
    } catch (err) {
      console.error(err);
      setStatus(status, "Error saving ❌ (check console)", "error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});

function formToObject(form) {
  const fd = new FormData(form);
  const obj = {};

  for (const [k, v] of fd.entries()) {
    // Keep "0" as valid; convert "" to ""
    obj[k] = typeof v === "string" ? v.trim() : v;
  }
  return obj;
}

function setStatus(el, msg, type) {
  el.textContent = msg;
  el.style.padding = msg ? "10px 12px" : "0";
  el.style.borderRadius = "6px";

  if (!msg) {
    el.style.border = "none";
    el.style.background = "transparent";
    return;
  }

  if (type === "success") {
    el.style.border = "1px solid #2d6a2d";
    el.style.background = "#153015";
  } else if (type === "error") {
    el.style.border = "1px solid #7a2a2a";
    el.style.background = "#2a1212";
  } else {
    el.style.border = "1px solid #444";
    el.style.background = "#232323";
  }
}
