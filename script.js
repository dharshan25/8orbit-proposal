/* ============================================
   8ORBIT STUDIOS — Proposal Page Scripts V3
   Alive + Interactive + Cursor Glow
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Cursor Glow Follower ----
  const cursorGlow = document.querySelector('.cursor-glow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorGlow.classList.contains('active')) {
        cursorGlow.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }


  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));


  // ---- 3D Tilt + Light Tracking on Glass Cards ----
  const glassCards = document.querySelectorAll('.glass, .glass-light');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `translateY(-6px) scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ---- 3D Tilt on Comparison Cards ----
  document.querySelectorAll('.comparison-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `translateY(-10px) scale(1.02) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ---- 3D Tilt on Video Cards ----
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      card.style.transform = `translateY(-10px) scale(1.02) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ---- Animated Number Counters ----
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-count'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      const decimals = (target % 1 !== 0) ? 1 : 0;
      const duration = 2200;
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = eased * target;
        if (decimals > 0) {
          counter.textContent = prefix + current.toFixed(decimals) + suffix;
        } else {
          counter.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        }
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = decimals > 0
            ? prefix + target.toFixed(decimals) + suffix
            : prefix + target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(update);
    });
  }

  const countersSection = document.getElementById('results');
  if (countersSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) animateCounters();
      });
    }, { threshold: 0.3 });
    counterObserver.observe(countersSection);
  }


  // ---- Top Navigation ----
  const topNav = document.getElementById('topNav');
  const hero = document.querySelector('.hero');
  const navLinks = document.querySelectorAll('.top-nav-link[data-section]');
  const mobileLinks = document.querySelectorAll('.top-nav-mobile-link[data-section]');
  const allNavLinks = document.querySelectorAll('.top-nav-link[data-section], .top-nav-mobile-link[data-section]');
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');

  // Show/hide nav on scroll (appear after hero)
  function updateNavVisibility() {
    if (!topNav || !hero) return;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.scrollY > heroBottom - 200) {
      topNav.classList.add('visible');
    } else {
      topNav.classList.remove('visible');
    }
  }

  // Track active section
  function updateActiveNav() {
    const sectionIds = ['contact', 'why-us', 'services', 'funnel', 'videos', 'process', 'analytics', 'results', 'before-after', 'case-study', 'opportunity', 'hero'];
    let activeId = 'hero';
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && scrollPos >= el.offsetTop) activeId = id;
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === activeId);
    });
  }

  function onScroll() {
    updateNavVisibility();
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll for nav links
  allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.getElementById(this.getAttribute('data-section'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (hamburger) hamburger.classList.remove('open');
    });
  });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }


  // ---- Chart.js — Views Line Chart ----
  const viewsCtx = document.getElementById('viewsChart');
  if (viewsCtx) {
    const viewsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initViewsChart();
          viewsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    viewsObserver.observe(viewsCtx);
  }

  function initViewsChart() {
    const ctx = viewsCtx.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 3', 'Day 5', 'Day 7', 'Day 9', 'Day 11', 'Day 13', 'Day 15', 'Day 17'],
        datasets: [{
          label: 'Views',
          data: [45, 120, 210, 380, 520, 780, 1100, 1800, 3007],
          borderColor: '#e8c49a',
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return 'rgba(232, 196, 154, 0.1)';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(232, 196, 154, 0.25)');
            gradient.addColorStop(0.5, 'rgba(196, 154, 108, 0.08)');
            gradient.addColorStop(1, 'rgba(196, 154, 108, 0.01)');
            return gradient;
          },
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#e8c49a',
          pointBorderColor: '#603813',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#e8c49a',
          pointHoverBorderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13, 7, 4, 0.95)',
            titleColor: '#e8c49a',
            bodyColor: '#f5ede3',
            borderColor: 'rgba(232, 196, 154, 0.3)',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 14,
            displayColors: false,
            titleFont: { family: 'Inter', weight: '600', size: 13 },
            bodyFont: { family: 'Inter', size: 13 },
            callbacks: {
              label: (context) => context.parsed.y.toLocaleString() + ' views'
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(232, 196, 154, 0.05)' },
            ticks: { color: 'rgba(245, 237, 227, 0.4)', font: { family: 'Inter', size: 11 } },
            border: { color: 'rgba(232, 196, 154, 0.08)' }
          },
          y: {
            grid: { color: 'rgba(232, 196, 154, 0.05)' },
            ticks: {
              color: 'rgba(245, 237, 227, 0.4)',
              font: { family: 'Inter', size: 11 },
              callback: (value) => value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value
            },
            border: { display: false },
            beginAtZero: true
          }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    });
  }


  // ---- Chart.js — Audience Doughnut Chart ----
  const audienceCtx = document.getElementById('audienceChart');
  if (audienceCtx) {
    const audienceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initAudienceChart();
          audienceObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    audienceObserver.observe(audienceCtx);
  }

  function initAudienceChart() {
    const ctx = audienceCtx.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['New Audience (Non-Followers)', 'Existing Followers'],
        datasets: [{
          data: [77.5, 22.5],
          backgroundColor: ['#e8c49a', 'rgba(196, 154, 108, 0.12)'],
          borderColor: ['rgba(232, 196, 154, 0.9)', 'rgba(196, 154, 108, 0.06)'],
          borderWidth: 2,
          hoverBackgroundColor: ['#f5ede3', 'rgba(196, 154, 108, 0.25)'],
          hoverBorderColor: ['#e8c49a', 'rgba(196, 154, 108, 0.2)'],
          spacing: 5,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(245, 237, 227, 0.7)',
              font: { family: 'Inter', size: 12 },
              padding: 20,
              usePointStyle: true,
              pointStyleWidth: 10,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(13, 7, 4, 0.95)',
            titleColor: '#e8c49a',
            bodyColor: '#f5ede3',
            borderColor: 'rgba(232, 196, 154, 0.3)',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 14,
            displayColors: true,
            callbacks: {
              label: (context) => ' ' + context.label + ': ' + context.parsed + '%'
            }
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: function(chart) {
          const { width, height, ctx } = chart;
          ctx.restore();
          ctx.font = '700 30px "Playfair Display", serif';
          ctx.fillStyle = '#e8c49a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.fillText('77.5%', width / 2, centerY - 10);
          ctx.font = '500 12px "Inter", sans-serif';
          ctx.fillStyle = 'rgba(245, 237, 227, 0.5)';
          ctx.fillText('New Audience', width / 2, centerY + 16);
          ctx.save();
        }
      }]
    });
  }


  // ---- Video Placeholder Click ----
  document.querySelectorAll('.video-placeholder').forEach(placeholder => {
    placeholder.addEventListener('click', function() {
      const videoWrapper = this.closest('.video-wrapper');
      const video = videoWrapper.querySelector('video');
      if (video && video.src) {
        this.style.display = 'none';
        video.play();
      }
    });
  });


  // ---- Smooth scroll for anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });


  // ---- Hero Parallax ----
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.12}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    }, { passive: true });
  }


  // ---- Orb Parallax on Scroll ----
  const orbs = document.querySelectorAll('.floating-orb');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i % 3 + 1) * 0.02;
      orb.style.marginTop = scrolled * speed * -1 + 'px';
    });
  }, { passive: true });


  // ---- Initial state ----
  onScroll();
});