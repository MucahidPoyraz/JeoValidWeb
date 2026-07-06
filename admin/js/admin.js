document.addEventListener('DOMContentLoaded', function () {

  var wrapper = document.querySelector('.admin-wrapper');
  var backdrop = document.querySelector('.admin-backdrop');
  if (!wrapper) return;

  /* ============ Sidebar: desktop collapse (icon-only) ============ */
  var COLLAPSE_KEY = 'jv_admin_sidebar_collapsed';
  var desktopToggle = document.querySelector('.admin-desktop-toggle');
  try {
    if (localStorage.getItem(COLLAPSE_KEY) === '1') wrapper.classList.add('sidebar-collapsed');
  } catch (e) {}
  if (desktopToggle) {
    desktopToggle.addEventListener('click', function () {
      wrapper.classList.toggle('sidebar-collapsed');
      try { localStorage.setItem(COLLAPSE_KEY, wrapper.classList.contains('sidebar-collapsed') ? '1' : '0'); } catch (e) {}
    });
  }

  /* ============ Sidebar: mobile off-canvas ============ */
  var mobileToggle = document.querySelector('.admin-mobile-toggle');
  var sidebarClose = document.querySelector('.admin-sidebar-close');
  function openMobileSidebar() {
    wrapper.classList.add('sidebar-mobile-open');
    if (backdrop) backdrop.classList.add('show');
  }
  function closeMobileSidebar() {
    wrapper.classList.remove('sidebar-mobile-open');
    if (backdrop) backdrop.classList.remove('show');
  }
  if (mobileToggle) mobileToggle.addEventListener('click', openMobileSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeMobileSidebar);
  if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);
  document.querySelectorAll('.admin-nav-link:not([data-bs-toggle])').forEach(function (link) {
    link.addEventListener('click', function () { closeMobileSidebar(); });
  });

  /* ============ Active menu highlighting ============ */
  var currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var currentFileHash = currentFile + (location.hash || '').toLowerCase();
  document.querySelectorAll('[data-page]').forEach(function (link) {
    var page = (link.getAttribute('data-page') || '').toLowerCase();
    if (!page) return;
    var isMatch = page.indexOf('#') > -1 ? (page === currentFileHash) : (page === currentFile);
    if (isMatch) {
      link.classList.add('active');
      var parentCollapse = link.closest('.collapse');
      if (parentCollapse) {
        parentCollapse.classList.add('show');
        var trigger = document.querySelector('[data-bs-target="#' + parentCollapse.id + '"]');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }
    }
  });

  /* Sekme değiştiğinde içindeki DataTable genişliğini yeniden hesapla (gizli sekmede oluşturulan tablolar için) */
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach(function (tabEl) {
    tabEl.addEventListener('shown.bs.tab', function (e) {
      var targetSel = e.target.getAttribute('data-bs-target') || e.target.getAttribute('href');
      var pane = targetSel ? document.querySelector(targetSel) : null;
      if (pane && window.jQuery && jQuery.fn.DataTable) {
        jQuery(pane).find('table.admin-datatable').each(function () {
          if (jQuery.fn.DataTable.isDataTable(this)) { jQuery(this).DataTable().columns.adjust(); }
        });
      }
    });
  });

  /* Activate tab based on URL hash (#collar, #survey, vb.) */
  if (location.hash) {
    var tabTrigger = document.querySelector('[data-bs-toggle="tab"][href="' + location.hash + '"], [data-bs-toggle="tab"][data-bs-target="' + location.hash + '"]');
    if (tabTrigger && window.bootstrap) {
      try { new bootstrap.Tab(tabTrigger).show(); } catch (e) {}
    }
  }

  /* ============ DataTables init ============ */
  if (window.jQuery && jQuery.fn.DataTable) {
    jQuery('.admin-datatable').each(function () {
      jQuery(this).DataTable({
        pageLength: 8,
        lengthChange: true,
        responsive: true,
        language: {
          search: '',
          searchPlaceholder: 'Ara...',
          lengthMenu: 'Sayfada _MENU_ kayıt',
          info: 'Toplam _TOTAL_ kayıttan _START_-_END_ arası gösteriliyor',
          infoEmpty: 'Kayıt bulunamadı',
          infoFiltered: '(_MAX_ kayıt içinden filtrelendi)',
          zeroRecords: 'Eşleşen kayıt bulunamadı',
          paginate: { previous: '‹', next: '›' }
        }
      });
    });
  }

  /* ============ Chart.js: dashboard grafikleri ============ */
  if (window.Chart) {
    Chart.defaults.color = '#8791a8';
    Chart.defaults.font.family = "'Mulish','Muli',sans-serif";
    Chart.defaults.borderColor = 'rgba(255,255,255,.08)';

    var weeklyCanvas = document.getElementById('weeklyValidationChart');
    if (weeklyCanvas) {
      new Chart(weeklyCanvas, {
        type: 'line',
        data: {
          labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
          datasets: [{
            label: 'Doğrulanan Veri Seti',
            data: [180, 240, 210, 300, 260, 150, 190],
            borderColor: '#38BDF8',
            backgroundColor: function (ctx) {
              var g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
              g.addColorStop(0, 'rgba(56,189,248,.35)');
              g.addColorStop(1, 'rgba(56,189,248,0)');
              return g;
            },
            fill: true, tension: .4, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#38BDF8'
          }, {
            label: 'Yeni Kullanıcı',
            data: [40, 55, 38, 62, 58, 30, 45],
            borderColor: '#14B8A6',
            backgroundColor: 'transparent',
            fill: false, tension: .4, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#14B8A6'
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle' } } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(255,255,255,.06)' }, beginAtZero: true }
          }
        }
      });
    }

    var datasetTypeCanvas = document.getElementById('datasetTypeChart');
    if (datasetTypeCanvas) {
      new Chart(datasetTypeCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Collar', 'Survey', 'Lithology', 'Assay'],
          datasets: [{ data: [32, 27, 23, 18], backgroundColor: ['#8B5CF6', '#06B6D4', '#10B981', '#F97316'], borderWidth: 0, hoverOffset: 6 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '68%',
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle' } } }
        }
      });
    }

    var revenueCanvas = document.getElementById('revenueChart');
    if (revenueCanvas) {
      new Chart(revenueCanvas, {
        type: 'bar',
        data: {
          labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
          datasets: [{
            label: 'PRO Abonelik (tahmini)',
            data: [62, 74, 81, 90, 102, 118],
            backgroundColor: '#0F766E', borderRadius: 6, maxBarThickness: 34
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255,255,255,.06)' }, beginAtZero: true } }
        }
      });
    }
  }

  /* ============ Basit form intercept (statik demo, backend yok) ============ */
  document.querySelectorAll('.admin-demo-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var toastEl = document.getElementById('adminToast');
      if (toastEl && window.bootstrap) {
        var msgTarget = toastEl.querySelector('.toast-body');
        if (msgTarget) msgTarget.textContent = form.getAttribute('data-success-msg') || 'İşlem başarıyla kaydedildi (statik demo).';
        bootstrap.Toast.getOrCreateInstance(toastEl).show();
      }
      var modalParent = form.closest('.modal');
      if (modalParent && window.bootstrap) {
        var inst = bootstrap.Modal.getInstance(modalParent);
        if (inst) inst.hide();
      }
    });
  });

});
