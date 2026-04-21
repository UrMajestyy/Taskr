/* ============================================================
   TASKR — app.js
   One file for the entire site. Sections:
     1. State (user, cart, wishlist)
     2. Data (services, workers)
     3. Utilities (toast, helpers)
     4. Navbar
     5. Services grid + category filter
     6. Cart
     7. Wishlist
     8. Auth (login, register, guest)
     9. Service detail page
    10. Dashboard (worker portal)
    11. Confirmation page
    12. DOMContentLoaded — wires everything up
   ============================================================ */

/* ============================================================
   1. STATE
   ============================================================ */
var State = {
  currentUser: null,
  cart:     JSON.parse(localStorage.getItem('taskr_cart')     || '[]'),
  wishlist: JSON.parse(localStorage.getItem('taskr_wishlist') || '[]'),

  saveCart: function () {
    localStorage.setItem('taskr_cart', JSON.stringify(this.cart));
  },
  saveWishlist: function () {
    localStorage.setItem('taskr_wishlist', JSON.stringify(this.wishlist));
  },
  loadUser: function () {
    var u = localStorage.getItem('taskr_user');
    this.currentUser = u ? JSON.parse(u) : null;
    return this.currentUser;
  },
  setUser: function (user) {
    this.currentUser = user;
    if (user) localStorage.setItem('taskr_user', JSON.stringify(user));
    else       localStorage.removeItem('taskr_user');
  },
  logout: function () {
    this.setUser(null);
    this.cart = [];
    this.saveCart();
    // Navigate to root index from anywhere
    var depth = window.location.pathname.split('/').filter(Boolean).length;
    window.location.href = depth > 1 ? '../index.html' : 'index.html';
  }
};

State.loadUser();

/* ============================================================
   2. DATA
   ============================================================ */
var SERVICES = [
  { id: 1, title: 'Deep Home Cleaning',       category: 'Cleaning',   worker: 'Nomsa Dlamini',   workerId: 1, price: 350, rating: 4.8, reviews: 124, img: 'images/cleaning.jpg', tag: 'Top Rated'   },
  { id: 2, title: 'Garden Maintenance',        category: 'Gardening',  worker: 'Sipho Nkosi',     workerId: 2, price: 280, rating: 4.6, reviews: 87,  img: 'images/gardening.jpg', tag: ''            },
  { id: 3, title: 'Maths & Science Tutoring',  category: 'Tutoring',   worker: 'Ayanda Mokoena',  workerId: 3, price: 200, rating: 4.9, reviews: 210, img: 'images/Tutoring.jpg', tag: 'Most Booked' },
  { id: 4, title: 'Plumbing Repairs',          category: 'Plumbing',   worker: 'Themba Khumalo',  workerId: 4, price: 400, rating: 4.5, reviews: 65,  img: 'images/Plumbing.jpg', tag: ''            },
  { id: 5, title: 'Electrical Installations',  category: 'Electrical', worker: 'Lungelo Sithole', workerId: 5, price: 500, rating: 4.7, reviews: 98,  img: 'images/Electricity.jpg', tag: ''            },
  { id: 6, title: 'Painting & Décor',          category: 'Painting',   worker: 'Zanele Masondo',  workerId: 6, price: 450, rating: 4.6, reviews: 52,  img: 'images/Painting.jpg', tag: ''            },
  { id: 7, title: 'English & Writing Tutoring',category: 'Tutoring',   worker: 'Precious Mthembu',workerId: 7, price: 180, rating: 4.8, reviews: 145, img: 'images/Tutoring.jpg', tag: ''            },
  { id: 8, title: 'Laundry & Ironing',         category: 'Cleaning',   worker: 'Bongi Radebe',    workerId: 8, price: 150, rating: 4.4, reviews: 43,  img: 'images/Ironing.jpg', tag: ''            },
];

var WORKERS = {
  1: {
    name: 'Nomsa Dlamini', joined: '2022', jobs: 312, rating: 4.8, reviews: 124,
    bio: 'I have been providing professional cleaning services across Cape Town for over 6 years. Every home I step into gets the same level of care and attention to detail.',
    proofs: [
      { type: 'before-after', before: 'images/Cleaning before.png', after: 'images/Cleaning after.png', desc: 'Complete lounge deep clean — removed years of built-up grime.' },
      { type: 'before-after', before: 'images/Cleaning before.png', after: 'images/Cleaning after.png', desc: 'Bathroom tile restoration including grout scrubbing.' }
    ]
  },
  2: {
    name: 'Sipho Nkosi', joined: '2023', jobs: 178, rating: 4.6, reviews: 87,
    bio: 'A certified horticulturist with a passion for transforming outdoor spaces into lush, well-kept sanctuaries.',
    proofs: [
      { type: 'before-after', before: 'images/Gardening before.jpg', after: 'images/Gardening after.jpg', desc: 'Overgrown suburban garden — full trim, edging and replanting.' }
    ]
  },
  3: {
    name: 'Ayanda Mokoena', joined: '2021', jobs: 490, rating: 4.9, reviews: 210,
    bio: 'BSc graduate with a decade of tutoring experience. Specialising in Grades 10–12 Maths and Physical Science.',
    proofs: [
      { type: 'result', before: '32%', after: '78%', desc: 'Six-week intensive Maths programme — mid-year to final exam.' }
    ]
  },
  4: {
    name: 'Themba Khumalo', joined: '2022', jobs: 145, rating: 4.5, reviews: 65,
    bio: 'Licensed plumber with 8 years of experience handling everything from leaking taps to full bathroom installations.',
    proofs: [
      { type: 'before-after', before: 'images/Plumbing before.jpeg', after: 'images/Plumbing after.jpeg', desc: 'Full bathroom re-pipe and fixture replacement in Kenilworth.' }
    ]
  },
  5: {
    name: 'Lungelo Sithole', joined: '2023', jobs: 98, rating: 4.7, reviews: 98,
    bio: 'Certified electrician specialising in residential wiring, DB board upgrades and solar panel installation.',
    proofs: [
      { type: 'before-after', before: 'images/electric before.jpg', after: 'images/electric after.jpg', desc: 'DB board upgrade and safety certificate — Durbanville home.' }
    ]
  },
  6: {
    name: 'Zanele Masondo', joined: '2022', jobs: 87, rating: 4.6, reviews: 52,
    bio: 'Interior painting and decorating professional. I work with the client to choose the right colours and finishes.',
    proofs: [
      { type: 'before-after', before: 'images/Painting before.jpg', after: 'images/Painting after.jpg', desc: 'Full interior repaint — 3-bedroom home in Observatory.' }
    ]
  },
  7: {
    name: 'Precious Mthembu', joined: '2021', jobs: 320, rating: 4.8, reviews: 145,
    bio: 'English teacher and writing coach helping learners from Grade 8 through to university level.',
    proofs: [
      { type: 'result', before: '41%', after: '75%', desc: 'Grade 10 learner improved from 41% to 75% in English Home Language.' }
    ]
  },
  8: {
    name: 'Bongi Radebe', joined: '2024', jobs: 43, rating: 4.4, reviews: 43,
    bio: 'Reliable laundry and ironing service for busy households. I collect, wash, iron and deliver — you just relax.',
    proofs: [
      { type: 'before-after', before: 'images/Ironing before.jpg', after: 'images/Ironing after.jpeg', desc: 'Laundry collection to delivery — 15kg load, same-day turnaround.' }
    ]
  },
};

/* ============================================================
   3. UTILITIES
   ============================================================ */

// Show a temporary toast notification at the bottom-right
function showToast(msg, type) {
  type = type || 'info';
  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var icons = { success: '✓', error: '✕', info: '●' };
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<span>' + (icons[type] || '●') + '</span><span>' + msg + '</span>';
  container.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 3500);
}

// Update the cart badge number in the navbar
function updateCartBadge() {
  var badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = State.cart.length;
    badge.style.display = State.cart.length ? 'flex' : 'none';
  }
}

// Update the wishlist badge number in the navbar
function updateWishlistBadge() {
  var badge = document.getElementById('wishlist-badge');
  if (badge) {
    badge.textContent = State.wishlist.length;
    badge.style.display = State.wishlist.length ? 'flex' : 'none';
  }
}

/* ============================================================
   4. NAVBAR
   ============================================================ */
function initNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Add shadow on scroll
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  // Highlight the active nav link
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // Render login/logout area based on who is signed in
  var userArea = document.getElementById('nav-user-area');
  if (userArea) {
    if (State.currentUser) {
      var initials = State.currentUser.name.split(' ').map(function (n) { return n[0]; }).join('').slice(0, 2).toUpperCase();
      var firstName = State.currentUser.name.split(' ')[0];
      var role      = State.currentUser.role;
      var dashLink  = role === 'worker' ? '<a href="dashboard.html">📊 Dashboard</a>' : '';
      // Fix href depending on whether we're in /pages/ or root
      var inPages   = window.location.pathname.includes('');
      if (!inPages) {
        dashLink = role === 'worker' ? '<a href="dashboard.html">📊 Dashboard</a>' : '';
      }

      userArea.innerHTML =
        '<div class="user-pill" id="user-pill">' +
          '<div class="user-avatar">' + initials + '</div>' +
          '<span class="user-pill-name">' + firstName + '</span>' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>' +
          '<div class="user-dropdown" id="user-dropdown">' +
            '<div class="user-dropdown-header">' +
              '<div class="uname">' + State.currentUser.name + '</div>' +
              '<div class="urole">' + (role === 'worker' ? 'Service Provider' : 'Customer') + '</div>' +
            '</div>' +
            dashLink +
            '<div class="divider"></div>' +
            '<button id="nav-logout-btn">↩ Sign out</button>' +
          '</div>' +
        '</div>';

      document.getElementById('user-pill').addEventListener('click', function (e) {
        e.stopPropagation();
        document.getElementById('user-dropdown').classList.toggle('open');
      });
      document.getElementById('nav-logout-btn').addEventListener('click', function () {
        State.logout();
      });

    } else {
      // Not logged in — show sign in / join buttons
      var inPages = window.location.pathname.includes('');
      var prefix  = inPages ? '' : '';
      userArea.innerHTML =
        '<a href="' + prefix + 'login.html"    class="btn btn-ghost btn-sm">Sign in</a>' +
        '<a href="' + prefix + 'register.html" class="btn btn-primary btn-sm">Join free</a>';
    }
  }

  // Close user dropdown when clicking elsewhere
  document.addEventListener('click', function (e) {
    var dd = document.getElementById('user-dropdown');
    var pill = document.getElementById('user-pill');
    if (dd && pill && !pill.contains(e.target)) dd.classList.remove('open');
  });

  // Live search dropdown
  var searchInput    = document.getElementById('nav-search-input');
  var searchDropdown = document.getElementById('search-dropdown');
  if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      if (q.length < 2) { searchDropdown.classList.remove('open'); return; }

      var results = SERVICES.filter(function (s) {
        return s.title.toLowerCase().includes(q) ||
               s.category.toLowerCase().includes(q) ||
               s.worker.toLowerCase().includes(q);
      }).slice(0, 5);

      if (!results.length) { searchDropdown.classList.remove('open'); return; }

      var inPages = window.location.pathname.includes('');
      var detailPath = inPages ? 'service-detail.html' : 'service-detail.html';

      searchDropdown.innerHTML = results.map(function (s) {
        return '<div class="search-result-item" onclick="window.location.href=\'' + detailPath + '?id=' + s.id + '\'">' +
          '<div><div class="sri-text">' + s.title + '</div><div class="sri-cat">' + s.category + ' · ' + s.worker + '</div></div>' +
        '</div>';
      }).join('');
      searchDropdown.classList.add('open');
    });

    document.addEventListener('click', function (e) {
      if (!searchInput.closest('.nav-search').contains(e.target)) searchDropdown.classList.remove('open');
    });
  }

  updateCartBadge();
  updateWishlistBadge();
}

/* ============================================================
   5. SERVICES GRID + CATEGORY FILTER
   ============================================================ */
function renderServiceCards(filter) {
  filter = filter || 'All';
  var grid = document.getElementById('services-grid');
  if (!grid) return;

  var filtered = filter === 'All' ? SERVICES : SERVICES.filter(function (s) { return s.category === filter; });
  var inPages  = window.location.pathname.includes('');
  var detailPath = inPages ? 'service-detail.html' : 'service-detail.html';

  grid.innerHTML = filtered.map(function (s) {
    var wishlisted = State.wishlist.some(function (w) { return w.id === s.id; });
    return '<div class="service-card" onclick="window.location.href=\'' + detailPath + '?id=' + s.id + '\'">' +
      '<div class="sc-img">' +
        '<div class="sc-category-tag">' + (s.tag || s.category) + '</div>' +
        '<button class="sc-wishlist ' + (wishlisted ? 'active' : '') + '" data-id="' + s.id + '" ' +
          'onclick="event.stopPropagation(); toggleWishlist(' + s.id + ')">' + (wishlisted ? '❤️' : '🤍') + '</button>' +
        '<img src="' + s.img + '" alt="' + s.title + '" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />' +
        '<div class="sc-img-overlay"></div>' +
      '</div>' +
      '<div class="sc-body">' +
        '<div class="sc-title">' + s.title + '</div>' +
        '<div class="sc-worker">by ' + s.worker + '</div>' +
        '<div class="sc-meta">' +
          '<div class="sc-price">R' + s.price + ' <span>/ session</span></div>' +
          '<div class="sc-rating"><span class="stars">★</span> ' + s.rating + ' <span style="color:var(--slate)">(' + s.reviews + ')</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function initCategoryFilter() {
  document.querySelectorAll('.cat-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.cat-pill').forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      renderServiceCards(this.dataset.cat);
    });
  });
}

/* ============================================================
   6. CART
   ============================================================ */
function addToCart(serviceId) {
  if (!State.currentUser) {
    showToast('Please sign in to book a service', 'error');
    setTimeout(function () { window.location.href = 'login.html'; }, 1200);
    return;
  }
  if (State.currentUser.role === 'guest') {
    showToast('Create an account to complete bookings', 'error');
    return;
  }
  var service = SERVICES.find(function (s) { return s.id === serviceId; });
  if (!service) return;
  if (State.cart.find(function (c) { return c.id === serviceId; })) {
    showToast('Already in your cart', 'info');
    return;
  }
  State.cart.push(Object.assign({}, service));
  State.saveCart();
  updateCartBadge();
  showToast('"' + service.title + '" added to cart ✓', 'success');
}

function removeFromCart(serviceId) {
  State.cart = State.cart.filter(function (c) { return c.id !== serviceId; });
  State.saveCart();
  updateCartBadge();
  renderCart();
}

function renderCart() {
  var container = document.getElementById('cart-items-container');
  var emptyEl   = document.getElementById('cart-empty');
  var summaryEl = document.getElementById('cart-summary');
  if (!container) return;

  if (!State.cart.length) {
    container.innerHTML = '';
    if (emptyEl)   emptyEl.style.display   = 'block';
    if (summaryEl) summaryEl.style.display  = 'none';
    return;
  }

  if (emptyEl)   emptyEl.style.display   = 'none';
  if (summaryEl) summaryEl.style.display  = 'grid';

  container.innerHTML = State.cart.map(function (item) {
    return '<div class="cart-item">' +
      '<div class="cart-item-img"><img src="' + item.img + '" alt="' + item.title + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" /></div>' +
      '<div>' +
        '<div class="cart-item-name">' + item.title + '</div>' +
        '<div class="cart-item-worker">by ' + item.worker + '</div>' +
        '<button class="cart-item-remove" onclick="removeFromCart(' + item.id + ')">Remove</button>' +
      '</div>' +
      '<div class="cart-item-price">R' + item.price + '</div>' +
    '</div>';
  }).join('');

  var subtotal = State.cart.reduce(function (sum, i) { return sum + i.price; }, 0);
  var fee      = Math.round(subtotal * 0.05);
  var total    = subtotal + fee;

  document.getElementById('summary-subtotal').textContent = 'R' + subtotal;
  document.getElementById('summary-fee').textContent      = 'R' + fee;
  document.getElementById('summary-total').textContent    = 'R' + total;
}

/* ============================================================
   7. WISHLIST
   ============================================================ */
function toggleWishlist(serviceId) {
  var service = SERVICES.find(function (s) { return s.id === serviceId; });
  if (!service) return;

  var idx = State.wishlist.findIndex(function (w) { return w.id === serviceId; });
  if (idx > -1) {
    State.wishlist.splice(idx, 1);
    showToast('Removed from wishlist', 'info');
  } else {
    State.wishlist.push(Object.assign({}, service));
    showToast('Added to wishlist ❤️', 'success');
  }

  State.saveWishlist();
  updateWishlistBadge();

  // Update all heart buttons on the page for this service
  document.querySelectorAll('.sc-wishlist[data-id="' + serviceId + '"]').forEach(function (btn) {
    var nowWished = idx === -1; // was not wished, now is
    btn.classList.toggle('active', nowWished);
    btn.textContent = nowWished ? '❤️' : '🤍';
  });

  renderWishlistPanel();
}

function renderWishlistPanel() {
  var body = document.getElementById('wishlist-panel-body');
  if (!body) return;
  if (!State.wishlist.length) {
    body.innerHTML = '<div class="wishlist-empty">No saved services yet.<br>Tap the heart on any service to save it.</div>';
    return;
  }
  body.innerHTML = State.wishlist.map(function (item) {
    return '<div class="wishlist-item">' +
      '<div class="wi-img"><img src="' + item.img + '" alt="' + item.title + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" /></div>' +
      '<div><div class="wi-name">' + item.title + '</div><div class="wi-price">R' + item.price + ' · ' + item.worker + '</div></div>' +
      '<button class="wi-remove" onclick="toggleWishlist(' + item.id + ')">✕</button>' +
    '</div>';
  }).join('');
}

function openWishlistPanel() {
  document.getElementById('wishlist-overlay') && document.getElementById('wishlist-overlay').classList.add('open');
  document.getElementById('wishlist-panel')   && document.getElementById('wishlist-panel').classList.add('open');
  renderWishlistPanel();
}

function closeWishlistPanel() {
  document.getElementById('wishlist-overlay') && document.getElementById('wishlist-overlay').classList.remove('open');
  document.getElementById('wishlist-panel')   && document.getElementById('wishlist-panel').classList.remove('open');
}

/* ============================================================
   8. AUTH
   ============================================================ */
function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('login-email').value.trim();
  var pwd   = document.getElementById('login-pwd').value;
  var role  = (document.querySelector('.auth-tab.active') || {}).dataset.role || 'customer';

  if (!email || !pwd) { showToast('Please fill in all fields', 'error'); return; }

  var nameMap = { customer: 'Khanyi Sithole', worker: 'Nomsa Dlamini', guest: 'Guest User' };
  var user = { name: nameMap[role] || 'User', email: email, role: role };
  State.setUser(user);
  showToast('Welcome back, ' + user.name.split(' ')[0] + '! 👋', 'success');
  setTimeout(function () {
    window.location.href = role === 'worker' ? 'dashboard.html' : '../index.html';
  }, 800);
}

function handleRegister(e) {
  e.preventDefault();
  var name  = document.getElementById('reg-name').value.trim();
  var email = document.getElementById('reg-email').value.trim();
  var pwd   = document.getElementById('reg-pwd').value;
  var roleInput = document.querySelector('input[name="role"]:checked');
  var role  = roleInput ? roleInput.value : 'customer';

  if (!name || !email || !pwd) { showToast('Please fill in all required fields', 'error'); return; }

  var user = { name: name, email: email, role: role };
  State.setUser(user);
  showToast('Account created! Welcome, ' + name.split(' ')[0] + ' 🎉', 'success');
  setTimeout(function () {
    window.location.href = role === 'worker' ? 'dashboard.html' : '../index.html';
  }, 800);
}

/* ============================================================
   9. SERVICE DETAIL PAGE
   ============================================================ */
function initServiceDetail() {
  var params  = new URLSearchParams(window.location.search);
  var id      = parseInt(params.get('id') || '1');
  var service = SERVICES.find(function (s) { return s.id === id; });

  if (!service) {
    document.getElementById('sd-title').textContent = 'Service not found';
    return;
  }

  // Fill in all the text
  document.title = service.title + ' — Taskr';
  document.getElementById('sd-breadcrumb').textContent = service.title;
  document.getElementById('sd-title').textContent      = service.title;
  document.getElementById('sd-meta').textContent       = '★ ' + service.rating + ' (' + service.reviews + ' reviews) · ' + service.category;
  document.getElementById('sd-icon-box').innerHTML = '<img src="' + service.img + '" alt="' + service.title + '" style="width:100%;height:100%;object-fit:cover;" />';;
  document.getElementById('sd-price').textContent      = service.price;

  // Fill in worker details
  var worker = WORKERS[service.workerId];
  if (worker) {
    var initials = worker.name.split(' ').map(function (n) { return n[0]; }).join('').slice(0, 2);
    document.getElementById('sd-worker-initials').textContent = initials;
    document.getElementById('sd-worker-name').textContent     = worker.name;
    document.getElementById('sd-worker-joined').textContent   = 'Member since ' + worker.joined;
    document.getElementById('sd-worker-bio').textContent      = worker.bio;
    document.getElementById('sd-worker-jobs').textContent     = worker.jobs;
    document.getElementById('sd-worker-rating').textContent   = worker.rating;
    document.getElementById('sd-worker-reviews').textContent  = worker.reviews;

    // Build proof cards
    var proofsEl = document.getElementById('sd-proofs');
    if (proofsEl) {
      worker.proofs.forEach(function (proof) {
        var card = document.createElement('div');

        if (proof.type === 'before-after') {
          card.className = 'proof-card';
          card.innerHTML =
            '<div class="proof-imgs">' +
              '<div class="proof-img-box before"><img src="' + proof.before + '" alt="Before" style="width:100%;height:100%;object-fit:cover;" /></div>' +
              '<div class="proof-img-box after"><img src="'  + proof.after  + '" alt="After"  style="width:100%;height:100%;object-fit:cover;" /></div>' +
              '<div class="proof-divider"></div>' +
              '<div class="proof-label before-lbl">Before</div>' +
              '<div class="proof-label after-lbl">After</div>'   +
            '</div>' +
            '<div class="proof-body"><div class="proof-desc">' + proof.desc + '</div></div>';
        } else {
          // Result card (e.g. tutoring scores)
          card.style.cssText = 'background:var(--light-grey);border-radius:var(--radius);padding:20px;margin-bottom:16px';
          card.innerHTML =
            '<div style="display:flex;gap:32px;justify-content:center;margin-bottom:12px">' +
              '<div style="text-align:center">' +
                '<div style="font-size:0.78rem;color:var(--slate);margin-bottom:4px">Before</div>' +
                '<div style="font-size:2rem;font-weight:700;color:var(--danger)">' + proof.before + '</div>' +
              '</div>' +
              '<div style="font-size:1.5rem;align-self:center;color:var(--teal)">→</div>' +
              '<div style="text-align:center">' +
                '<div style="font-size:0.78rem;color:var(--slate);margin-bottom:4px">After</div>' +
                '<div style="font-size:2rem;font-weight:700;color:var(--success)">' + proof.after + '</div>' +
              '</div>' +
            '</div>' +
            '<div style="font-size:0.85rem;color:var(--slate);text-align:center">' + proof.desc + '</div>';
        }

        proofsEl.appendChild(card);
      });
    }
  }

  // Add to cart button
  var bookBtn = document.getElementById('sd-book-btn');
  if (bookBtn) {
    bookBtn.addEventListener('click', function () { addToCart(id); });
  }
}

/* ============================================================
   10. DASHBOARD (worker portal)
   ============================================================ */
function initDashboard() {
  var user = State.currentUser;

  // Only workers can view the dashboard
  if (!user || user.role !== 'worker') {
    showToast('Please sign in as a service provider', 'error');
    setTimeout(function () { window.location.href = 'login.html'; }, 1200);
    return;
  }

  // Fill in the worker's name
  var firstName = user.name.split(' ')[0];
  document.getElementById('sidebar-name').textContent  = user.name;
  document.getElementById('greeting-name').textContent = firstName;

  // Pre-fill the profile form (use saved profile data if available)
  var saved = JSON.parse(localStorage.getItem('taskr_worker_profile') || 'null');
  document.getElementById('pf-name').value  = saved ? saved.name  : user.name;
  document.getElementById('pf-email').value = saved ? saved.email : (user.email || '');
  document.getElementById('pf-phone').value = saved ? saved.phone : '';
  document.getElementById('pf-bio').value   = saved ? saved.bio   : 'Tell customers about yourself and your experience.';
  document.getElementById('pf-area').value  = saved ? saved.area  : 'Cape Town';
  document.getElementById('pf-rate').value  = saved ? saved.rate  : '350';
  if (saved && saved.service) {
    var sel = document.getElementById('pf-service');
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text === saved.service) { sel.selectedIndex = i; break; }
    }
  }

  // Save profile on form submit
  document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var profile = {
      name:    document.getElementById('pf-name').value,
      email:   document.getElementById('pf-email').value,
      phone:   document.getElementById('pf-phone').value,
      bio:     document.getElementById('pf-bio').value,
      service: document.getElementById('pf-service').value,
      area:    document.getElementById('pf-area').value,
      rate:    document.getElementById('pf-rate').value
    };
    localStorage.setItem('taskr_worker_profile', JSON.stringify(profile));
    user.name = profile.name;
    State.setUser(user);
    showToast('Profile updated successfully ✓', 'success');
  });

  // --- Bookings data ---
  var bookings = [
    { customer: 'Khanyi Sithole',     service: 'Deep Home Clean',   date: 'Tomorrow 10:00', price: 'R350', status: 'Confirmed', cls: 'chip-green'  },
    { customer: 'Luthando Dube',      service: 'Laundry & Ironing', date: 'Fri 14:00',      price: 'R150', status: 'Pending',   cls: 'chip-yellow' },
    { customer: 'Precious Khumalo',   service: 'Home Cleaning',     date: 'Sat 09:00',      price: 'R350', status: 'Confirmed', cls: 'chip-green'  },
    { customer: 'Siphamandla Ngcobo', service: 'Deep Home Clean',   date: 'Mon 10:00',      price: 'R350', status: 'Confirmed', cls: 'chip-green'  },
  ];

  // Upcoming bookings (first 3 shown on overview)
  var upcomingEl = document.getElementById('upcoming-bookings-list');
  bookings.slice(0, 3).forEach(function (b) {
    var row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:48px 1fr auto;gap:16px;align-items:center;padding:14px 0;border-bottom:1px solid var(--border)';
    row.innerHTML =
      '<div style="width:44px;height:44px;border-radius:10px;background:var(--teal-faint);display:flex;align-items:center;justify-content:center;font-size:1.4rem">🧹</div>' +
      '<div>' +
        '<div style="font-weight:600;font-size:0.92rem">' + b.customer + '</div>' +
        '<div style="font-size:0.8rem;color:var(--slate)">' + b.service + ' · ' + b.date + '</div>' +
      '</div>' +
      '<span class="chip ' + b.cls + '">' + b.status + '</span>';
    upcomingEl.appendChild(row);
  });

  // "View all" button switches to the bookings tab
  document.getElementById('view-all-btn').addEventListener('click', function () {
    showDashSection('bookings');
    document.querySelectorAll('.sidebar-link').forEach(function (l) { l.classList.remove('active'); });
    document.querySelector('[data-section="bookings"]').classList.add('active');
  });

  // All bookings list
  var allEl = document.getElementById('all-bookings-list');
  bookings.forEach(function (b) {
    var row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:1fr auto auto;gap:16px;align-items:center;padding:16px 0;border-bottom:1px solid var(--border)';
    row.innerHTML =
      '<div>' +
        '<div style="font-weight:600">' + b.customer + '</div>' +
        '<div style="font-size:0.82rem;color:var(--slate)">' + b.service + ' · ' + b.date + '</div>' +
      '</div>' +
      '<div style="font-weight:700">' + b.price + '</div>' +
      '<span class="chip ' + b.cls + '">' + b.status + '</span>';
    allEl.appendChild(row);
  });

  // --- Payouts ---
  var payouts = [
    { date: '15 Apr 2026', amount: 'R2,100', status: 'Paid' },
    { date: '1 Apr 2026',  amount: 'R1,750', status: 'Paid' },
    { date: '15 Mar 2026', amount: 'R2,400', status: 'Paid' },
  ];
  var payoutsEl = document.getElementById('payouts-list');
  payouts.forEach(function (p) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)';
    row.innerHTML =
      '<span style="font-size:0.9rem;color:var(--slate)">' + p.date + '</span>' +
      '<span style="font-weight:700">' + p.amount + '</span>' +
      '<span class="chip chip-green">' + p.status + '</span>';
    payoutsEl.appendChild(row);
  });

  // --- Proof items ---
  var proofs = [
    { icon: '📸', name: 'Kitchen before & after — Bellville client', type: 'Photo · Before/After' },
    { icon: '📸', name: 'Bathroom tile restoration — Claremont',     type: 'Photo · Before/After' },
    { icon: '🎥', name: 'Full lounge clean timelapse — Pinelands',   type: 'Video · Process' },
  ];
  var proofsListEl = document.getElementById('proof-items-list');
  proofs.forEach(function (p) {
    var item = document.createElement('div');
    item.className = 'proof-item';
    item.innerHTML =
      '<div class="pi-thumb">' + p.icon + '</div>' +
      '<div><div class="pi-name">' + p.name + '</div><div class="pi-type">' + p.type + '</div></div>' +
      '<div class="pi-actions">' +
        '<button class="pi-btn edit"  onclick="showToast(\'Edit — live feature coming soon\',\'info\')">Edit</button>' +
        '<button class="pi-btn del"   onclick="this.closest(\'.proof-item\').remove(); showToast(\'Deleted\',\'success\')">Delete</button>' +
      '</div>';
    proofsListEl.appendChild(item);
  });

  // Upload area click
  document.getElementById('proof-upload-area').addEventListener('click', function () {
    showToast('In the live app, this opens your file picker', 'info');
  });

  // --- Availability day toggles ---
  var days       = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var activeDays = [true,  true,  true,  true,  true,  false, false];
  var daysGrid   = document.getElementById('days-grid');

  days.forEach(function (day, i) {
    var btn = document.createElement('div');
    btn.style.cssText = 'text-align:center;padding:12px 8px;border-radius:10px;border:2px solid;font-size:0.85rem;font-weight:600;cursor:pointer;transition:all 0.2s';
    btn.textContent = day;
    applyDayStyle(btn, activeDays[i]);
    btn.addEventListener('click', function () {
      activeDays[i] = !activeDays[i];
      applyDayStyle(btn, activeDays[i]);
    });
    daysGrid.appendChild(btn);
  });

  function applyDayStyle(el, active) {
    el.style.borderColor = active ? 'var(--teal)'   : 'var(--border)';
    el.style.background  = active ? 'var(--teal-faint)' : 'var(--white)';
    el.style.color       = active ? 'var(--teal)'   : 'var(--slate)';
  }

  document.getElementById('save-avail-btn').addEventListener('click', function () {
    showToast('Availability saved ✓', 'success');
  });

  // --- FAQ ---
  var faqs = [
    { q: 'How do I get paid?',          a: 'Taskr releases payment to your bank account within 2 business days of a completed booking.' },
    { q: 'What if a customer cancels?', a: 'If cancelled more than 24h before your arrival you receive no payment. Within 24h you receive 50% of the agreed amount.' },
    { q: 'Can I set my own prices?',    a: 'Yes — set your own session rate when you update your profile.' },
  ];
  var faqEl = document.getElementById('faq-list');
  faqs.forEach(function (f) {
    var item = document.createElement('div');
    item.style.cssText = 'padding:16px 0;border-bottom:1px solid var(--border)';
    item.innerHTML = '<div style="font-weight:600;margin-bottom:6px">' + f.q + '</div><div style="font-size:0.88rem;color:var(--slate)">' + f.a + '</div>';
    faqEl.appendChild(item);
  });

  // --- Logout ---
  document.getElementById('logout-btn').addEventListener('click', function () {
    State.logout();
  });

  // --- Sidebar navigation ---
  document.querySelectorAll('.sidebar-link[data-section]').forEach(function (link) {
    link.addEventListener('click', function () {
      document.querySelectorAll('.sidebar-link').forEach(function (l) { l.classList.remove('active'); });
      this.classList.add('active');
      showDashSection(this.getAttribute('data-section'));
    });
  });

  // Helper: show one dashboard section, hide all others
  function showDashSection(name) {
    document.querySelectorAll('.dash-section').forEach(function (s) { s.style.display = 'none'; });
    var target = document.getElementById('section-' + name);
    if (target) target.style.display = 'block';
  }
}

/* ============================================================
   11. CONFIRMATION PAGE
   ============================================================ */
function initConfirmation() {
  var booking = JSON.parse(localStorage.getItem('taskr_last_booking') || 'null');
  if (!booking) { window.location.href = '../index.html'; return; }

  document.getElementById('conf-ref').textContent   = booking.ref;
  document.getElementById('conf-date').textContent  = booking.date;
  document.getElementById('conf-total').textContent = 'R' + booking.total;

  var itemsEl = document.getElementById('conf-items');
  if (itemsEl) {
    itemsEl.innerHTML = booking.items.map(function (i) {
      return '<li><img src="' + i.img + '" alt="' + i.title + '" style="width:32px;height:32px;object-fit:cover;border-radius:6px;margin-right:8px;vertical-align:middle;" /><span>' + i.title + ' — R' + i.price + '</span></li>';
    }).join('');
  }

  updateCartBadge();
  updateWishlistBadge();
}

/* ============================================================
   12. DOMContentLoaded — wire everything up
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // Always run navbar
  initNavbar();

  // Wishlist panel buttons
  var wBtn  = document.getElementById('wishlist-btn');
  var wOver = document.getElementById('wishlist-overlay');
  var wClose= document.getElementById('wishlist-close-btn');
  if (wBtn)  wBtn.addEventListener('click', openWishlistPanel);
  if (wOver) wOver.addEventListener('click', closeWishlistPanel);
  if (wClose)wClose.addEventListener('click', closeWishlistPanel);

  // Services grid (home + services page)
  if (document.getElementById('services-grid')) {
    renderServiceCards();
    initCategoryFilter();
  }

  // Cart page
  if (document.getElementById('cart-items-container')) {
    renderCart();
  }

  // Login form
  var loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Register form
  var regForm = document.getElementById('register-form');
  if (regForm) regForm.addEventListener('submit', handleRegister);

  // Auth tabs (login page)
  document.querySelectorAll('.auth-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.auth-tab').forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  // Role selection cards (register page)
  document.querySelectorAll('.role-card').forEach(function (card) {
    card.addEventListener('click', function () {
      document.querySelectorAll('.role-card').forEach(function (c) { c.classList.remove('selected'); });
      this.classList.add('selected');
      var inp = this.querySelector('input[name="role"]');
      if (inp) inp.checked = true;
    });
  });

  // Contact form
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast("Message sent! We'll get back to you within 24 hours.", 'success');
      contactForm.reset();
    });
  }

  // Service detail page
  if (document.getElementById('sd-title')) {
    initServiceDetail();
  }

  // Worker dashboard
  if (document.getElementById('dashboard-root')) {
    initDashboard();
  }

  // Confirmation page
  if (document.getElementById('confirmation-root')) {
    initConfirmation();
  }

});
