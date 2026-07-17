/* ============================================
   8ORBIT STUDIOS — Proposal Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

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
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;

        if (decimals > 0) {
          counter.textContent = prefix + current.toFixed(decimals) + suffix;
        } else {
          counter.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (decimals > 0) {
            counter.textContent = prefix + target.toFixed(decimals) + suffix;
          } else {
            counter.textContent = prefix + target.toLocaleString() + suffix;
          }
        }
      }

      requestAnimationFrame(update);
    });
  }

  const countersSection = document.getElementById('results');
  if (countersSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(countersSection);
  }

  // ---- Navigation Dots ----
  const sections = document.querySelectorAll('.section[id]');
  const navDots = document.querySelectorAll('.nav-dot');

  function updateActiveDot() {
    let currentIndex = 0;
    const scrollPos = window.scrollY + window.innerHeight / 2;

    sections.forEach((section, index) => {
      if (scrollPos >= section.offsetTop) {
        currentIndex = index;
      }
    });

    navDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  window.addEventListener('scroll', updateActiveDot, { passive: true });

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

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
          borderColor: '#d4a574',
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return 'rgba(212, 165, 116, 0.1)';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(212, 165, 116, 0.25)');
            gradient.addColorStop(1, 'rgba(212, 165, 116, 0.02)');
            return gradient;
          },
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#d4a574',
          pointBorderColor: '#603813',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#d4a574',
          pointHoverBorderColor: '#f5ede3',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(26, 14, 4, 0.9)',
            titleColor: '#d4a574',
            bodyColor: '#f5ede3',
            borderColor: 'rgba(196, 154, 108, 0.3)',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            displayColors: false,
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'Inter' },
            callbacks: {
              label: function(context) {
                return context.parsed.y.toLocaleString() + ' views';
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(196, 154, 108, 0.06)' },
            ticks: {
              color: 'rgba(245, 237, 227, 0.4)',
              font: { family: 'Inter', size: 11 }
            },
            border: { color: 'rgba(196, 154, 108, 0.1)' }
          },
          y: {
            grid: { color: 'rgba(196, 154, 108, 0.06)' },
            ticks: {
              color: 'rgba(245, 237, 227, 0.4)',
              font: { family: 'Inter', size: 11 },
              callback: function(value) {
                return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value;
              }
            },
            border: { display: false },
            beginAtZero: true
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
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
          backgroundColor: ['#d4a574', 'rgba(196, 154, 108, 0.2)'],
          borderColor: ['rgba(212, 165, 116, 0.8)', 'rgba(196, 154, 108, 0.1)'],
          borderWidth: 2,
          hoverBackgroundColor: ['#c49a6c', 'rgba(196, 154, 108, 0.35)'],
          hoverBorderColor: ['#d4a574', 'rgba(196, 154, 108, 0.3)'],
          spacing: 4,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
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
            backgroundColor: 'rgba(26, 14, 4, 0.9)',
            titleColor: '#d4a574',
            bodyColor: '#f5ede3',
            borderColor: 'rgba(196, 154, 108, 0.3)',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return ' ' + context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: function(chart) {
          const { width, height, ctx } = chart;
          ctx.restore();
          const text = '77.5%';
          const subtext = 'New';
          ctx.font = '700 28px "Playfair Display", serif';
          ctx.fillStyle = '#d4a574';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.fillText(text, width / 2, centerY - 10);
          ctx.font = '500 12px "Inter", sans-serif';
          ctx.fillStyle = 'rgba(245, 237, 227, 0.5)';
          ctx.fillText(subtext + ' Audience', width / 2, centerY + 16);
          ctx.save();
        }
      }]
    });
  }

  // ---- Video Placeholder Click Handlers ----
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

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Parallax-like subtle effect on hero ----
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    }, { passive: true });
  }

  // ---- Initial dot update ----
  updateActiveDot();
});