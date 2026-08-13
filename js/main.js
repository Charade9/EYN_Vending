document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile nav ----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Vending shelf ----
  var slots = document.querySelectorAll('.slot');
  var tray = document.querySelector('.vend-tray');
  var trayCode = document.querySelector('.tray-code');
  var trayTitle = document.querySelector('.tray-body h3');
  var trayDesc = document.querySelector('.tray-body p');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateTray(slot) {
    trayCode.textContent = slot.dataset.code;
    trayTitle.textContent = slot.dataset.title;
    trayDesc.textContent = slot.dataset.desc;
  }

  if (slots.length && tray && trayCode) {
    slots.forEach(function (slot) {
      slot.addEventListener('click', function () {
        if (slot.classList.contains('selected')) return;

        slots.forEach(function (s) { s.classList.remove('selected', 'vending'); });
        slot.classList.add('selected');

        if (reducedMotion) {
          updateTray(slot);
          return;
        }

        // Drop animation: product falls, tray flashes, content swaps mid-fall
        slot.classList.add('vending');
        tray.classList.remove('flash');
        setTimeout(function () { updateTray(slot); }, 300);
        setTimeout(function () {
          tray.classList.add('flash');
        }, 320);
        slot.addEventListener('animationend', function handler() {
          slot.classList.remove('vending');
          slot.removeEventListener('animationend', handler);
        });
      });
    });
  }

  // ---- Contact form -> pre-filled email ----
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) {
        var el = form.querySelector('#' + id);
        return el ? el.value : '';
      };
      var subject = 'Consultation Request from ' + v('name');
      var body =
        'Name: ' + v('name') + '\n' +
        'Email: ' + v('email') + '\n' +
        'Phone: ' + v('phone') + '\n' +
        'Location / Business: ' + v('location') + '\n' +
        'Interested in: ' + v('interest') + '\n\n' +
        'Message:\n' + v('message');
      window.location.href = 'mailto:info@eynvending.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    });
  }
});

  // ---- Suggestion box (suggest.html) ----
  var sform = document.getElementById('suggest-form');
  if (sform) {
    // 1. Read location from ?loc= (or ?location=) and display it
    var params = new URLSearchParams(window.location.search);
    var rawLoc = params.get('loc') || params.get('location') || '';
    var prettyLoc = decodeURIComponent(rawLoc).replace(/[-_+]/g, ' ').replace(/\s+/g, ' ').trim();
    var locDisplay = document.getElementById('loc-display');
    var locField = document.getElementById('loc-field');
    if (prettyLoc) {
      locDisplay.textContent = prettyLoc;
      locField.value = prettyLoc;
    } else {
      locField.value = 'Unspecified location';
    }

    // 2. Category chips — tap (or keyboard) to toggle
    var chips = document.querySelectorAll('.cat-chip');
    chips.forEach(function (chip) {
      function toggle() { chip.classList.toggle('selected'); }
      chip.addEventListener('click', toggle);
      chip.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });

    var statusEl = document.getElementById('form-status');
    var successEl = document.getElementById('suggest-success');
    var successMsg = document.getElementById('success-msg');
    var accessKey = sform.querySelector('[name="access_key"]').value;

    function showSuccess() {
      sform.style.display = 'none';
      if (prettyLoc) {
        successMsg.textContent = 'Thanks for helping us stock ' + prettyLoc +
          '. We review every suggestion before the next restock.';
      }
      successEl.classList.add('show');
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 3. Submit
    sform.addEventListener('submit', function (e) {
      e.preventDefault();

      // Gather selected categories into the hidden field
      var cats = Array.prototype.slice.call(document.querySelectorAll('.cat-chip.selected'))
        .map(function (c) { return c.dataset.cat; }).join(', ');
      document.getElementById('cat-field').value = cats || '(none picked)';

      // Fallback: if the Web3Forms key hasn't been set yet, open a pre-filled
      // email instead so the form still works out of the box.
      if (!accessKey || accessKey.indexOf('YOUR_ACCESS_KEY') !== -1) {
        var body =
          'Location: ' + locField.value + '\n' +
          'Categories: ' + document.getElementById('cat-field').value + '\n' +
          'Product: ' + document.getElementById('product').value + '\n' +
          'Email: ' + (document.getElementById('email').value || '(none)');
        window.location.href = 'mailto:info@eynvending.com'
          + '?subject=' + encodeURIComponent('Vending suggestion — ' + locField.value)
          + '&body=' + encodeURIComponent(body);
        return;
      }

      // Normal path: POST to Web3Forms via fetch, stay on page
      statusEl.className = 'form-status';
      statusEl.textContent = 'Sending…';
      var payload = {};
      new FormData(sform).forEach(function (v, k) { payload[k] = v; });

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          showSuccess();
        } else {
          statusEl.className = 'form-status error';
          statusEl.textContent = 'Something went wrong — please try again.';
        }
      })
      .catch(function () {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Network error — please try again.';
      });
    });

    // 4. "Suggest another" resets the form
    var againBtn = document.getElementById('suggest-again');
    if (againBtn) {
      againBtn.addEventListener('click', function () {
        sform.reset();
        chips.forEach(function (c) { c.classList.remove('selected'); });
        statusEl.textContent = '';
        successEl.classList.remove('show');
        sform.style.display = '';
        sform.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }
