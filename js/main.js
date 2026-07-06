document.addEventListener('DOMContentLoaded', function () {

  /* Navbar background on scroll */
  var navbar = document.querySelector('.hx-navbar');
  var toTop = document.querySelector('.hx-to-top');
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      toTop.classList.add('show');
    } else {
      navbar.classList.remove('scrolled');
      toTop.classList.remove('show');
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* Hero: 3 kullanıcı mesajı (Sondaj Ekipleri / Madenciler / Jeoloji Mühendisleri)
     arasında fade-out/fade-in ile döngüsel geçiş */
  var heroRotator = document.getElementById('heroRotator');
  var heroEyebrowEl = document.getElementById('heroEyebrow');
  var heroHeadlineEl = document.getElementById('heroHeadline');
  var heroDescEl = document.getElementById('heroDesc');
  if (heroRotator && heroEyebrowEl && heroHeadlineEl && heroDescEl) {
    var heroBlocks = [
      {
        eyebrow: 'Sondaj Ekipleri İçin',
        headline: 'Jeolojik Verilerinize Profesyonel Bir Güç Katın',
        desc: 'Collar, Survey, Lithology ve Assay verilerini saniyeler içinde doğrula, 3D görüntüle ve raporla.'
      },
      {
        eyebrow: 'Madenciler İçin',
        headline: 'Sahada Verimliliği Artırın, Kayıpları Azaltın',
        desc: 'Tenör analizlerinden rezerv hesaplamaya, tüm saha verilerinizi anında analiz edin.'
      },
      {
        eyebrow: 'Jeoloji Mühendisleri İçin',
        headline: 'Veri Doğrulamadan 3D Modele, Tek Platformda',
        desc: 'Sondaj loglarından litoloji haritalarına, tüm jeolojik verileri entegre edin.'
      }
    ];
    var heroIndex = 0;
    var heroReduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function applyHeroBlock(i) {
      var b = heroBlocks[i];
      heroEyebrowEl.textContent = b.eyebrow;
      heroHeadlineEl.textContent = b.headline;
      heroDescEl.textContent = b.desc;
    }
    applyHeroBlock(0);

    if (!heroReduceMotion) {
      setInterval(function () {
        heroRotator.classList.add('is-out');
        setTimeout(function () {
          heroIndex = (heroIndex + 1) % heroBlocks.length;
          applyHeroBlock(heroIndex);
          heroRotator.classList.remove('is-out');
        }, 500);
      }, 8000);
    }
  }

  /* Animate width-based bars/progress once visible */
  var widthTargets = document.querySelectorAll('[data-width]');
  var barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.style.width = el.getAttribute('data-width') + '%';
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  widthTargets.forEach(function (el) { barObserver.observe(el); });

  /* Donut charts (Token & Funds allocation) */
  if (window.Chart) {
    var chartOptions = {
      cutout: '70%',
      plugins: { legend: { display: false }, tooltip: { enabled: true } }
    };
    var labels = ['Token Sale', 'Reserve Capital', 'Founders', 'Team', 'Advisors'];
    var data = [30, 20, 30, 10, 10];
    var colors = ['#7d1267', '#9f1e85', '#bb3a88', '#d2538a', '#23293b'];

    document.querySelectorAll('.hx-pie-canvas').forEach(function (canvas) {
      new Chart(canvas, {
        type: 'doughnut',
        data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }] },
        options: chartOptions
      });
    });
  }

  /* Neden JeoValid carousel: dokunmatikte Bootstrap zaten kaydırmayı destekliyor,
     burada masaüstünde fare ile de sürüklenebilmesi için ekleniyor */
  var nedenCarouselEl = document.getElementById('nedenCarousel');
  if (nedenCarouselEl && window.bootstrap) {
    var nedenInner = nedenCarouselEl.querySelector('.carousel-inner');
    var nedenDown = false, nedenStartX = 0, nedenMoved = false;
    nedenInner.addEventListener('mousedown', function (e) {
      nedenDown = true; nedenMoved = false; nedenStartX = e.clientX;
      nedenInner.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', function (e) {
      if (!nedenDown) return;
      if (Math.abs(e.clientX - nedenStartX) > 8) nedenMoved = true;
    });
    window.addEventListener('mouseup', function (e) {
      if (!nedenDown) return;
      nedenDown = false;
      nedenInner.style.cursor = '';
      var dx = e.clientX - nedenStartX;
      if (Math.abs(dx) > 45) {
        var instance = bootstrap.Carousel.getOrCreateInstance(nedenCarouselEl);
        if (dx < 0) { instance.next(); } else { instance.prev(); }
      }
    });
    nedenInner.addEventListener('dragstart', function (e) { e.preventDefault(); });
    nedenInner.style.cursor = 'grab';
  }

  /* Müşteri Yorumu: yanlardaki kartların yarım/çeyrek göründüğü kaydırılabilir slider */
  var testiSlider = document.getElementById('testiSlider');
  if (testiSlider) {
    var testiTrack = testiSlider.querySelector('.hx-testi-track');
    var testiViewport = testiSlider.querySelector('.hx-testi-viewport');
    var testiSlides = Array.prototype.slice.call(testiTrack.querySelectorAll('.hx-testi-slide'));
    var testiDots = Array.prototype.slice.call(document.querySelectorAll('#testiDots [data-testi-to]'));
    var testiIndex = 0, testiTimer = null, testiDown = false, testiStartX = 0, testiDragX = 0;

    function testiBaseOffset() {
      var vw = testiViewport.clientWidth;
      var sw = testiSlides[0].offsetWidth;
      return (vw - sw) / 2 - testiIndex * sw;
    }
    function renderTesti() {
      testiTrack.style.transform = 'translateX(' + testiBaseOffset() + 'px)';
      testiSlides.forEach(function (s, i) { s.classList.toggle('is-active', i === testiIndex); });
      testiDots.forEach(function (d, i) { d.classList.toggle('active', i === testiIndex); });
    }
    function testiGoTo(i) {
      testiIndex = (i + testiSlides.length) % testiSlides.length;
      renderTesti();
    }
    function testiStop() { if (testiTimer) clearInterval(testiTimer); }
    function testiPlay() {
      testiStop();
      testiTimer = setInterval(function () { testiGoTo(testiIndex + 1); }, 5000);
    }

    var testiPrevBtn = testiSlider.querySelector('[data-testi-prev]');
    var testiNextBtn = testiSlider.querySelector('[data-testi-next]');
    if (testiPrevBtn) testiPrevBtn.addEventListener('click', function () { testiGoTo(testiIndex - 1); testiPlay(); });
    if (testiNextBtn) testiNextBtn.addEventListener('click', function () { testiGoTo(testiIndex + 1); testiPlay(); });
    testiDots.forEach(function (d, i) { d.addEventListener('click', function () { testiGoTo(i); testiPlay(); }); });
    testiSlides.forEach(function (s, i) {
      s.addEventListener('click', function () { if (i !== testiIndex) { testiGoTo(i); testiPlay(); } });
    });

    window.addEventListener('resize', renderTesti);
    testiSlider.addEventListener('mouseenter', testiStop);
    testiSlider.addEventListener('mouseleave', testiPlay);

    function testiDragStart(x) {
      testiDown = true; testiStartX = x; testiDragX = 0;
      testiTrack.classList.add('is-dragging');
      testiStop();
    }
    function testiDragMove(x) {
      if (!testiDown) return;
      testiDragX = x - testiStartX;
      testiTrack.style.transform = 'translateX(' + (testiBaseOffset() + testiDragX) + 'px)';
    }
    function testiDragEnd() {
      if (!testiDown) return;
      testiDown = false;
      testiTrack.classList.remove('is-dragging');
      if (Math.abs(testiDragX) > 45) {
        testiGoTo(testiIndex + (testiDragX < 0 ? 1 : -1));
      } else {
        renderTesti();
      }
      testiPlay();
    }
    testiViewport.addEventListener('mousedown', function (e) { testiDragStart(e.clientX); });
    window.addEventListener('mousemove', function (e) { testiDragMove(e.clientX); });
    window.addEventListener('mouseup', function () { testiDragEnd(); });
    testiViewport.addEventListener('dragstart', function (e) { e.preventDefault(); });

    testiViewport.addEventListener('touchstart', function (e) { testiDragStart(e.touches[0].clientX); }, { passive: true });
    testiViewport.addEventListener('touchmove', function (e) { testiDragMove(e.touches[0].clientX); }, { passive: true });
    testiViewport.addEventListener('touchend', function () { testiDragEnd(); });

    renderTesti();
    testiPlay();
  }

  /* Ana Banner Slider: klasik arka plan görselli, başlık/açıklamalı carousel;
     Neden JeoValid carousel'indeki gibi masaüstünde fare ile de sürüklenebilir */
  var bannerCarouselEl = document.getElementById('bannerCarousel');
  if (bannerCarouselEl && window.bootstrap) {
    var bannerInner = bannerCarouselEl.querySelector('.carousel-inner');
    var bannerDown = false, bannerStartX = 0, bannerMoved = false;
    bannerInner.addEventListener('mousedown', function (e) {
      bannerDown = true; bannerMoved = false; bannerStartX = e.clientX;
      bannerInner.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', function (e) {
      if (!bannerDown) return;
      if (Math.abs(e.clientX - bannerStartX) > 8) bannerMoved = true;
    });
    window.addEventListener('mouseup', function (e) {
      if (!bannerDown) return;
      bannerDown = false;
      bannerInner.style.cursor = '';
      var dx = e.clientX - bannerStartX;
      if (Math.abs(dx) > 45) {
        var instance = bootstrap.Carousel.getOrCreateInstance(bannerCarouselEl);
        if (dx < 0) { instance.next(); } else { instance.prev(); }
      }
    });
    bannerInner.addEventListener('dragstart', function (e) { e.preventDefault(); });
    bannerInner.style.cursor = 'grab';
  }

  /* Karşılama modalı: yenilikler + hızlı gezinme, yalnızca ilk ziyarette gösterilir.
     Yeni bir duyuru eklendiğinde WELCOME_KEY'deki sürüm numarasını artırmak modalı tekrar gösterir. */
  var welcomeModalEl = document.getElementById('welcomeModal');
  if (welcomeModalEl && window.bootstrap) {
    var WELCOME_KEY = 'jv_welcome_seen_v1';
    try {
      if (!localStorage.getItem(WELCOME_KEY)) {
        var welcomeModal = new bootstrap.Modal(welcomeModalEl);
        setTimeout(function () { welcomeModal.show(); }, 1200);
        welcomeModalEl.addEventListener('hidden.bs.modal', function () {
          localStorage.setItem(WELCOME_KEY, '1');
        });
      }
    } catch (e) { /* localStorage kullanılamıyorsa (gizli sekme vb.) modal hiç gösterilmez */ }
  }

  /* Subscribe form (static demo, no backend) */
  var subscribeForm = document.querySelector('.hx-subscribe');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = subscribeForm.querySelector('.hx-subscribe-msg');
      if (msg) { msg.textContent = 'Abone olduğunuz için teşekkürler!'; msg.classList.remove('d-none'); }
      subscribeForm.reset();
    });
  }

});
