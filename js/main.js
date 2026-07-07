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
