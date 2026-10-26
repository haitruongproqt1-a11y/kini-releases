/* ==========================================================
   KINI CHAT STUDIO - INTERACTIVE SCRIPT
   Author / Creator: Phùng Hải Trường
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Gallery Filter Tabs
  const filterBtns = document.querySelectorAll('.tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Close Lightbox on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightboxDirect();
    }
  });
});

// Technical Tabs Switcher
function switchTechTab(tabId) {
  const navBtns = document.querySelectorAll('.tech-nav-btn');
  const panes = document.querySelectorAll('.tab-pane');

  navBtns.forEach(btn => btn.classList.remove('active'));
  panes.forEach(pane => pane.classList.remove('active'));

  const targetPane = document.getElementById('pane-' + tabId);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  // Active button state
  event.currentTarget.classList.add('active');
}

// Lightbox Modal Functions
function openLightbox(imgSrc, captionText) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (lightbox && lightboxImg) {
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = captionText || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox(event) {
  if (event.target.id === 'lightbox' || event.target.classList.contains('lightbox-content')) {
    closeLightboxDirect();
  }
}

function closeLightboxDirect() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Copy SHA256 Checksum to Clipboard
function copyHash() {
  const hash = '2FF376F610D4B32CDAD588AFAB2BDE17EEF97A737CEF63409AAC789E7FEE6750';
  navigator.clipboard.writeText(hash).then(() => {
    const btn = document.querySelector('.btn-copy');
    if (btn) {
      const oldHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Đã sao chép!';
      btn.style.background = '#10b981';
      btn.style.color = '#ffffff';
      setTimeout(() => {
        btn.innerHTML = oldHtml;
        btn.style.background = '';
        btn.style.color = '';
      }, 2500);
    }
  }).catch(err => {
    console.error('Failed to copy hash: ', err);
  });
}
