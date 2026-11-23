/* Elia Esquivel — Mexican Restaurant, Wyoming MI
   Progressive enhancement only: the form works without JavaScript. */
(function () {
  "use strict";

  var ENDPOINT = "https://vision.leadrai.com/api/forms/00a385446fd99d291e542978c4311333";

  /* ---- Current year in the footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Hidden _page field = current URL (so visitors come back here) ---- */
  var pageField = document.getElementById("page-field");
  if (pageField) pageField.value = window.location.href;

  var form = document.getElementById("request-form");
  var alertBox = document.getElementById("form-alert");
  var submitBtn = document.getElementById("submit-btn");

  /* ---- Show confirmation after a plain (non-JS) submission ---- */
  function showConfirmation(scroll) {
    if (!alertBox) return;
    alertBox.hidden = false;
    if (scroll) {
      alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
      alertBox.setAttribute("tabindex", "-1");
      alertBox.focus({ preventScroll: true });
    }
  }

  try {
    if (new URLSearchParams(window.location.search).get("submitted") === "1") {
      showConfirmation(false);
    }
  } catch (e) { /* older browsers: plain submission still shows its own page */ }

  if (!form) return;

  /* ---- Inline validation helpers ---- */
  function clearError(field) {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
    var wrap = field.closest(".field");
    if (!wrap) return;
    var msg = wrap.querySelector(".error-msg");
    if (msg) msg.remove();
  }

  function setError(field, text) {
    clearError(field);
    field.setAttribute("aria-invalid", "true");
    var wrap = field.closest(".field");
    if (!wrap) return;
    var id = field.id + "-error";
    var msg = document.createElement("span");
    msg.className = "error-msg";
    msg.id = id;
    msg.textContent = text;
    wrap.appendChild(msg);
    field.setAttribute("aria-describedby", id);
  }

  function validate() {
    var firstBad = null;

    var name = form.querySelector("#f-name");
    var phone = form.querySelector("#f-phone");
    var email = form.querySelector("#f-email");

    if (name) {
      if (!name.value.trim()) {
        setError(name, "Please tell us your name.");
        firstBad = firstBad || name;
      } else { clearError(name); }
    }

    if (phone) {
      var digits = phone.value.replace(/[^0-9]/g, "");
      if (!phone.value.trim()) {
        setError(phone, "Please add a phone number so we can reply.");
        firstBad = firstBad || phone;
      } else if (digits.length < 7) {
        setError(phone, "Please enter a complete phone number.");
        firstBad = firstBad || phone;
      } else { clearError(phone); }
    }

    if (email) {
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setError(email, "Please check this email address.");
        firstBad = firstBad || email;
      } else { clearError(email); }
    }

    if (firstBad) {
      firstBad.focus();
      return false;
    }
    return true;
  }

  Array.prototype.forEach.call(form.querySelectorAll("input, textarea, select"), function (el) {
    el.addEventListener("input", function () {
      if (el.getAttribute("aria-invalid") === "true") clearError(el);
    });
  });

  /* ---- Submit via fetch to the same endpoint, with a plain-POST fallback ---- */
  form.addEventListener("submit", function (event) {
    if (!validate()) {
      event.preventDefault();
      return;
    }

    if (typeof window.fetch !== "function" || typeof FormData !== "function") {
      return; // let the browser do a normal POST
    }

    event.preventDefault();

    if (pageField) pageField.value = window.location.href;

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      payload[key] = typeof value === "string" ? value : String(value);
    });
    payload._page = window.location.href;

    var originalLabel = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Request failed: " + response.status);
        return response.json().catch(function () { return { ok: true }; });
      })
      .then(function (data) {
        if (data && data.ok === false) throw new Error("Submission rejected");
        form.reset();
        if (pageField) pageField.value = window.location.href;
        form.hidden = true;
        showConfirmation(true);
      })
      .catch(function () {
        // Network or server problem: fall back to a normal browser POST.
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        HTMLFormElement.prototype.submit.call(form);
      });
  });
})();
