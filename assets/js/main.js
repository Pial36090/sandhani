(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function filterCards(cards, query, specialty, availability) {
    var visible = 0;
    cards.forEach(function (card) {
      var matchesQuery = !query || card.textContent.toLowerCase().indexOf(query) !== -1;
      var matchesSpecialty = !specialty || card.dataset.specialty === specialty;
      var matchesAvailability = !availability || card.dataset.availability === availability;
      var show = matchesQuery && matchesSpecialty && matchesAvailability;
      card.hidden = !show;
      if (show) visible += 1;
    });
    return visible;
  }

  var departmentCards = Array.prototype.slice.call(document.querySelectorAll(".department-card[data-specialty]"));
  var departmentSearch = document.getElementById("department-search");
  var departmentType = document.getElementById("department-type");
  var departmentCount = document.getElementById("department-count");
  function updateDepartments() {
    var count = filterCards(departmentCards, departmentSearch ? departmentSearch.value.trim().toLowerCase() : "", departmentType ? departmentType.value : "", "");
    if (departmentCount) departmentCount.textContent = count + (count === 1 ? " department found" : " departments found");
  }
  if (departmentSearch) departmentSearch.addEventListener("input", updateDepartments);
  if (departmentType) departmentType.addEventListener("change", updateDepartments);
  if (departmentCards.length) updateDepartments();

  var doctorCards = Array.prototype.slice.call(document.querySelectorAll(".doctor-card[data-specialty]"));
  var doctorSearch = document.getElementById("doctor-search");
  var doctorSpecialty = document.getElementById("doctor-specialty");
  var doctorAvailability = document.getElementById("doctor-availability");
  var doctorCount = document.getElementById("doctor-count");
  function updateDoctors() {
    var count = filterCards(
      doctorCards,
      doctorSearch ? doctorSearch.value.trim().toLowerCase() : "",
      doctorSpecialty ? doctorSpecialty.value : "",
      doctorAvailability ? doctorAvailability.value : ""
    );
    if (doctorCount) doctorCount.textContent = count + (count === 1 ? " doctor found" : " doctors found");
  }
  if (doctorSearch) doctorSearch.addEventListener("input", updateDoctors);
  if (doctorSpecialty) doctorSpecialty.addEventListener("change", updateDoctors);
  if (doctorAvailability) doctorAvailability.addEventListener("change", updateDoctors);
  if (doctorCards.length) updateDoctors();

  function todayISO() {
    var now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  var visitDate = document.getElementById("visit-date");
  if (visitDate) visitDate.min = todayISO();

  var appointmentForm = document.getElementById("appointment-form");
  if (appointmentForm) {
    var appointmentParams = new URLSearchParams(window.location.search);
    var requestedDepartment = appointmentParams.get("department");
    var requestedDoctor = appointmentParams.get("doctor");
    var departmentSelect = document.getElementById("appointment-department");
    var doctorSelect = document.getElementById("appointment-doctor");
    if (requestedDepartment && departmentSelect) departmentSelect.value = requestedDepartment;
    if (requestedDoctor && doctorSelect) doctorSelect.value = requestedDoctor;

    var result = document.getElementById("appointment-result");
    var message = document.getElementById("appointment-result-message");
    var whatsapp = document.getElementById("whatsapp-confirmation");
    var newRequest = document.getElementById("new-appointment");

    appointmentForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var department = document.getElementById("appointment-department");
      var doctor = document.getElementById("appointment-doctor");
      var date = document.getElementById("visit-date");
      var time = document.getElementById("visit-time");
      var name = document.getElementById("patient-name");
      var phone = document.getElementById("patient-phone");
      var required = [department, date, time, name, phone];
      var firstInvalid = null;

      required.forEach(function (field) {
        var invalid = !field.value.trim() || (field === date && field.value < todayISO());
        field.setAttribute("aria-invalid", invalid ? "true" : "false");
        var error = document.querySelector('[data-error-for="' + field.id + '"]');
        if (error) {
          error.id = field.id + "-error";
          field.setAttribute("aria-describedby", error.id);
          error.textContent = invalid ? (field === date ? "Choose today or a future date." : "Please complete this field.") : "";
        }
        if (invalid && !firstInvalid) firstInvalid = field;
      });

      var phoneDigits = phone.value.replace(/\D/g, "");
      var phoneError = document.querySelector('[data-error-for="patient-phone"]');
      if (phoneDigits.length < 7) {
        phone.setAttribute("aria-invalid", "true");
        if (phoneError) {
          phoneError.id = "patient-phone-error";
          phone.setAttribute("aria-describedby", phoneError.id);
          phoneError.textContent = "Enter a valid phone number.";
        }
        firstInvalid = firstInvalid || phone;
      }
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var selectedDoctor = doctor.value || "the next available doctor";
      message.textContent = "Thanks, " + name.value.trim() + ". Your request for " + department.value +
        " with " + selectedDoctor + " on " + date.value + " at " + time.value +
        " is ready. Please confirm it with our team via WhatsApp.";
      var whatsappText = "Hello, I would like to request an appointment. Name: " + name.value.trim() +
        "; department: " + department.value + "; doctor: " + selectedDoctor + "; date: " + date.value +
        "; time: " + time.value + "; phone: " + phone.value.trim() + ".";
      whatsapp.href = "https://wa.me/8801319772783?text=" + encodeURIComponent(whatsappText);
      appointmentForm.hidden = true;
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    if (newRequest) {
      newRequest.addEventListener("click", function () {
        appointmentForm.reset();
        appointmentForm.hidden = false;
        result.hidden = true;
        appointmentForm.querySelectorAll("[aria-invalid]").forEach(function (field) {
          field.removeAttribute("aria-invalid");
        });
        appointmentForm.querySelectorAll(".error").forEach(function (error) { error.textContent = ""; });
        document.getElementById("appointment-department").focus();
      });
    }
  }

  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var contactResult = document.getElementById("contact-success");
    var contactReset = document.getElementById("contact-reset");
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var fields = Array.prototype.slice.call(contactForm.querySelectorAll("[required]"));
      var firstInvalid = null;
      fields.forEach(function (field) {
        var valid = field.type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()) : Boolean(field.value.trim());
        field.setAttribute("aria-invalid", valid ? "false" : "true");
        var error = document.querySelector('[data-error-for="' + field.id + '"]');
        if (error) {
          error.id = field.id + "-error";
          field.setAttribute("aria-describedby", error.id);
          error.textContent = valid ? "" : (field.type === "email" ? "Enter a valid email address." : "Please complete this field.");
        }
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      contactForm.hidden = true;
      contactResult.hidden = false;
    });
    if (contactReset) {
      contactReset.addEventListener("click", function () {
        contactForm.reset();
        contactForm.hidden = false;
        contactResult.hidden = true;
        contactForm.querySelectorAll("[aria-invalid]").forEach(function (field) {
          field.removeAttribute("aria-invalid");
        });
        contactForm.querySelectorAll(".error").forEach(function (error) { error.textContent = ""; });
        document.getElementById("c-name").focus();
      });
    }
  }
})();
