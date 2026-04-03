/* ==========================================================================
   Happy Valley Lake House — Guest Book
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Intersection Observer — Fade-in on scroll
     ------------------------------------------------------------------------ */
  function initFadeIn() {
    var els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------------
     2. Sticky Nav — "scrolled" class + active section highlighting
     ------------------------------------------------------------------------ */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var links = nav.querySelectorAll('.nav__links a[href^="#"]');
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) sections.push({ el: section, link: link });
    });

    var scrollThreshold = 100;
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        var scrollY = window.scrollY;

        // Toggle "scrolled" class on nav
        if (scrollY > scrollThreshold) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }

        // Highlight current section link
        if (sections.length) {
          var navHeight = nav.offsetHeight;
          var current = null;

          for (var i = sections.length - 1; i >= 0; i--) {
            var rect = sections[i].el.getBoundingClientRect();
            if (rect.top <= navHeight + 80) {
              current = sections[i];
              break;
            }
          }

          links.forEach(function (link) { link.classList.remove('active'); });
          if (current) current.link.classList.add('active');
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile nav toggle
    var toggle = nav.querySelector('.nav__toggle');
    var drawer = document.querySelector('.nav__mobile');

    if (toggle && drawer) {
      toggle.addEventListener('click', function () {
        drawer.classList.toggle('open');
        var isOpen = drawer.classList.contains('open');
        toggle.setAttribute('aria-expanded', isOpen);
      });

      // Close drawer when a link is tapped
      drawer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          drawer.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     3. Season Tabs
     ------------------------------------------------------------------------ */
  function initSeasonTabs() {
    var tabs = document.querySelectorAll('.season-tab');
    var panels = document.querySelectorAll('.season-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var season = tab.dataset.season;

        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        panels.forEach(function (panel) {
          if (panel.dataset.season === season) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Leaflet.js Interactive Map
     ------------------------------------------------------------------------ */
  function initMap() {
    var mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;

    // Center on Shutesbury
    var map = L.map('map', {
      scrollWheelZoom: false
    }).setView([42.459, -72.408], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Enable scroll zoom after first click
    map.once('click', function () {
      map.scrollWheelZoom.enable();
    });

    // Category colors
    var colors = {
      groceries: '#5A7D56',
      hiking: '#5B8FA8',
      eat: '#C47A5A',
      drink: '#8B7BAE',
      visit: '#C8A96E'
    };

    // Create a circle marker with category color
    function makeMarker(lat, lng, category) {
      return L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: colors[category],
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      });
    }

    // Marker data
    var places = [
      // Groceries
      {
        name: 'Leverett Village Co-op',
        lat: 42.452,
        lng: -72.499,
        cat: 'groceries',
        desc: 'Small but well-curated. Great basics, local produce, and a solid deli.',
        time: '7 min'
      },
      {
        name: 'Flis Market',
        lat: 42.577,
        lng: -72.599,
        cat: 'groceries',
        desc: 'Local staple with a good meat counter and everyday essentials.',
        time: '~15 min'
      },
      {
        name: 'Green Fields Market',
        lat: 42.588,
        lng: -72.601,
        cat: 'groceries',
        desc: 'Full-size natural grocery store in Greenfield. Has everything.',
        time: '20 min'
      },

      // Hiking
      {
        name: 'Lake Wyola State Park',
        lat: 42.467,
        lng: -72.405,
        cat: 'hiking',
        desc: 'Easy trails right around the lake. Beautiful and accessible.',
        time: '5 min'
      },
      {
        name: 'Ames Pond / Kestrel Land Trust',
        lat: 42.470,
        lng: -72.370,
        cat: 'hiking',
        desc: 'Quiet conservation land. Great for birding and peaceful walks.',
        time: '5 min'
      },
      {
        name: 'Mount Toby',
        lat: 42.491,
        lng: -72.534,
        cat: 'hiking',
        desc: 'Rewarding climb with panoramic views from the fire tower.',
        time: '15 min'
      },
      {
        name: 'Wendell State Forest',
        lat: 42.470,
        lng: -72.350,
        cat: 'hiking',
        desc: 'Miles of wooded trails. Feels remote and wild.',
        time: '10 min'
      },

      // Places to Visit
      {
        name: 'Peace Pagoda',
        lat: 42.467,
        lng: -72.346,
        cat: 'visit',
        desc: 'Buddhist peace pagoda in the woods of Leverett. Serene and surprising.',
        time: '10 min'
      },
      {
        name: 'Montague Book Mill',
        lat: 42.531,
        lng: -72.520,
        cat: 'visit',
        desc: '"Books you don\'t need in a place you can\'t find." A must-visit.',
        time: '15 min'
      },
      {
        name: 'Bridge of Flowers',
        lat: 42.626,
        lng: -72.739,
        cat: 'visit',
        desc: 'Retired trolley bridge covered in gardens. Stunning in summer and fall.',
        time: '40 min'
      },
      {
        name: 'Mass MoCA',
        lat: 42.700,
        lng: -73.111,
        cat: 'visit',
        desc: 'One of the best contemporary art museums in the country.',
        time: '1 hr+'
      },

      // Places to Eat
      {
        name: 'Dejabrew',
        lat: 42.468,
        lng: -72.410,
        cat: 'eat',
        desc: 'Quirky, beloved coffee shop and cafe in the middle of the woods.',
        time: '6 min'
      },
      {
        name: 'North Village Smokehouse',
        lat: 42.542,
        lng: -72.519,
        cat: 'eat',
        desc: 'Solid barbecue in a no-frills setting. Good portions, good vibe.',
        time: '15 min'
      },
      {
        name: 'Watershed',
        lat: 42.531,
        lng: -72.520,
        cat: 'eat',
        desc: 'Farm-to-table done right. Great for a nicer dinner out.',
        time: '15 min'
      },
      {
        name: 'Wagon Wheel',
        lat: 42.555,
        lng: -72.580,
        cat: 'eat',
        desc: 'Classic roadside restaurant with huge portions. Cash only.',
        time: '20 min'
      },

      // Places to Drink
      {
        name: 'Lady Killigrew',
        lat: 42.531,
        lng: -72.520,
        cat: 'drink',
        desc: 'Cozy pub with great beer and a patio overlooking the river.',
        time: '15 min'
      },
      {
        name: '4 Star Farms & Brewery',
        lat: 42.560,
        lng: -72.610,
        cat: 'drink',
        desc: 'Working farm with a taproom. Beautiful setting, excellent beer.',
        time: '20 min'
      },
      {
        name: 'Treehouse Brewery',
        lat: 42.449,
        lng: -72.349,
        cat: 'drink',
        desc: 'Some of the best beer in New England. Plan for a line.',
        time: '20 min'
      },
      {
        name: 'Element Brewery',
        lat: 42.480,
        lng: -72.427,
        cat: 'drink',
        desc: 'Small, local, and laid-back. A nice spot to grab a pint.',
        time: '10 min'
      }
    ];

    // Label map for legend
    var catLabels = {
      groceries: 'Groceries',
      hiking: 'Hiking',
      visit: 'Places to Visit',
      eat: 'Places to Eat',
      drink: 'Places to Drink'
    };

    // Add cabin marker
    L.marker([42.459, -72.408], {
      icon: L.divIcon({
        className: 'cabin-marker',
        html: '<div style="background:#2D4A3E;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);">&#8962;</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    })
      .addTo(map)
      .bindPopup(
        '<strong style="font-size:14px;">Happy Valley Lake House</strong><br>' +
        '<span style="color:#666;">45 Shore Drive, Shutesbury</span>'
      );

    // Add place markers
    places.forEach(function (place) {
      var marker = makeMarker(place.lat, place.lng, place.cat);
      marker.addTo(map).bindPopup(
        '<div style="min-width:180px;">' +
        '<strong style="font-size:14px;">' + place.name + '</strong><br>' +
        '<span style="display:inline-block;margin:4px 0 6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:' +
        colors[place.cat] + ';">' + catLabels[place.cat] + '</span><br>' +
        '<span style="color:#555;font-size:13px;">' + place.desc + '</span><br>' +
        '<span style="display:inline-block;margin-top:6px;font-size:12px;color:#888;">&#128663; ' +
        place.time + ' from the cabin</span>' +
        '</div>'
      );
    });

    // Add legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'map-legend');
      div.style.cssText =
        'background:#fff;padding:10px 14px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-size:12px;line-height:2;';

      var html = '<strong style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#999;">Legend</strong><br>';

      Object.keys(catLabels).forEach(function (cat) {
        html +=
          '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' +
          colors[cat] +
          ';margin-right:6px;vertical-align:middle;"></span>' +
          catLabels[cat] + '<br>';
      });

      div.innerHTML = html;
      return div;
    };

    legend.addTo(map);
  }

  /* ------------------------------------------------------------------------
     Init on DOM ready
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initFadeIn();
    initNav();
    initSeasonTabs();
    initMap();
  });
})();
