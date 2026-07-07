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
