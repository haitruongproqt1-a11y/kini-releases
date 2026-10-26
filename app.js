/* ==========================================================
   KINI CHAT - ĐỘNG CƠ KHÔNG GIAN 3D KỸ THUẬT SỐ & TƯƠNG TÁC
   Tác giả / Nhà sáng lập: Phùng Hải Trường
   Phiên bản chuẩn: v2.2.11 (Bản Dựng 151)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo Không Gian Ma Trận 3D Kỹ Thuật Số (Three.js)
  init3DDigitalBackground();

  // 2. Khởi tạo hiệu ứng nghiêng 3D (Tilt Effect) trên các thẻ nổi
  init3DTiltCards();

  // 3. Khởi tạo bộ lọc thư viện hình ảnh thực tế
  initGalleryTabs();

  // 4. Lắng nghe phím ESC để đóng khung phóng to ảnh (Lightbox)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightboxDirect();
    }
  });
});

/* ==========================================================
   KHỞI TẠO MA TRẬN KHÔNG GIAN 3D (THREE.JS ENGINE)
   ========================================================== */
function init3DDigitalBackground() {
  const canvas = document.getElementById('canvas3d');
  if (!canvas || typeof THREE === 'undefined') return;

  // Khởi tạo Scene, Camera và Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050813, 0.0012);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 180, 480);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 1. Lưới Ma Trận Sóng Kỹ Thuật Số (Digital Wave Terrain)
  const planeWidth = 1600;
  const planeHeight = 1200;
  const planeSegmentsX = 48;
  const planeSegmentsY = 36;
  const planeGeometry = new THREE.PlaneGeometry(
    planeWidth,
    planeHeight,
    planeSegmentsX,
    planeSegmentsY
  );
  planeGeometry.rotateX(-Math.PI / 2);

  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x14b8a6,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });

  const terrainMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  terrainMesh.position.y = -120;
  scene.add(terrainMesh);

  // Lưu trữ độ cao gốc của các đỉnh
  const posAttribute = planeGeometry.attributes.position;
  const originalZ = [];
  for (let i = 0; i < posAttribute.count; i++) {
    originalZ.push(posAttribute.getY(i));
  }

  // 2. Đám Mây Hạt Số Vũ Trụ (Cyber Particle Field)
  const particleCount = 1200;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 1600;
    particlePositions[i + 1] = Math.random() * 600 - 100;
    particlePositions[i + 2] = (Math.random() - 0.5) * 1200;
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 2.8,
    transparent: true,
    opacity: 0.65
  });

  const particleCloud = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleCloud);

  // 3. Khối Đa Diện Vi Mạch 3D Bay Lơ Lửng (Floating Cyber Polyhedrons)
  const polyhedrons = [];
  const polyGeo1 = new THREE.IcosahedronGeometry(35, 1);
  const polyGeo2 = new THREE.OctahedronGeometry(28, 0);

  const polyMat1 = new THREE.MeshBasicMaterial({
    color: 0x2dd4bf,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const polyMat2 = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });

  const poly1 = new THREE.Mesh(polyGeo1, polyMat1);
  poly1.position.set(-320, 160, -100);
  scene.add(poly1);
  polyhedrons.push({ mesh: poly1, speedX: 0.005, speedY: 0.008 });

  const poly2 = new THREE.Mesh(polyGeo2, polyMat2);
  poly2.position.set(360, 220, -150);
  scene.add(poly2);
  polyhedrons.push({ mesh: poly2, speedX: 0.007, speedY: 0.006 });

  // Tương tác chuột mượt mà (Mouse Parallax)
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.4;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.3;
  });

  // Vòng lặp Render 3D 60 FPS
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Làm dập dềnh sóng số 3D (Sine wave terrain)
    const positions = planeGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const wave = Math.sin(x * 0.015 + elapsedTime * 1.5) * 16 +
                   Math.cos(z * 0.018 + elapsedTime * 1.2) * 14;
      positions.setY(i, wave);
    }
    positions.needsUpdate = true;

    // 2. Quay nhẹ các khối đa diện công nghệ
    polyhedrons.forEach(p => {
      p.mesh.rotation.x += p.speedX;
      p.mesh.rotation.y += p.speedY;
    });

    // 3. Quay từ từ đám mây hạt số
    particleCloud.rotation.y = elapsedTime * 0.03;

    // 4. Easing Camera theo chuột
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 0.6;
    camera.position.y = 180 - targetY * 0.3;
    camera.lookAt(0, -30, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Xử lý khi thay đổi kích thước cửa sổ
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ==========================================================
   HIỆU ỨNG NGHIÊNG 3D (3D TILT EFFECT CHO CÁC THẺ)
   ========================================================== */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.tilt-card, .tilt-btn');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================
   BỘ LỌC THƯ VIỆN HÌNH ẢNH THỰC TẾ
   ========================================================== */
function initGalleryTabs() {
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
}

/* ==========================================================
   CHUYỂN ĐỔI TAB ĐÁNH GIÁ KỸ THUẬT
   ========================================================== */
function switchTechTab(tabId) {
  const navBtns = document.querySelectorAll('.tech-nav-btn');
  const panes = document.querySelectorAll('.tab-pane');

  navBtns.forEach(btn => btn.classList.remove('active'));
  panes.forEach(pane => pane.classList.remove('active'));

  const targetPane = document.getElementById('pane-' + tabId);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  // Cập nhật trạng thái nút được bấm
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
}

/* ==========================================================
   XEM PHÓNG TO ẢNH (LIGHTBOX MODAL)
   ========================================================== */
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

/* ==========================================================
   SAO CHÉP MÃ BĂM SHA-256 KIỂM ĐỊNH
   ========================================================== */
function copyHash() {
  const hash = '2FF376F610D4B32CDAD588AFAB2BDE17EEF97A737CEF63409AAC789E7FEE6750';
  navigator.clipboard.writeText(hash).then(() => {
    const btn = document.querySelector('.btn-copy');
    if (btn) {
      const oldHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Đã Sao Chép!';
      btn.style.background = '#10b981';
      btn.style.color = '#ffffff';
      setTimeout(() => {
        btn.innerHTML = oldHtml;
        btn.style.background = '';
        btn.style.color = '';
      }, 2500);
    }
  }).catch(err => {
    console.error('Không thể sao chép: ', err);
  });
}
