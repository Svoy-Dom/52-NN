// --- Navigation / Menu Toggle ---
const navbarToggle = document.querySelector('.navbar__toggle');
const navbarMenu = document.querySelector('.navbar__menu');
if (navbarToggle && navbarMenu) {
  navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
  });
}

// --- Smooth scrolling for internal links ---
const internalLinks = document.querySelectorAll('a[href^="#"]');
internalLinks.forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Закрытие меню на мобиле
      if (navbarMenu && navbarMenu.classList.contains('active')) {
        navbarToggle.click();
      }
    }
  });
});

// --- Preloader ---
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.style.display = 'none', 500);
  }
});

// --- AOS initialization ---
if (typeof AOS !== 'undefined') {
  AOS.init({ once: true, duration: 700, offset: 80 });
}

// --- Калькулятор ---
const calculatorPrices = {
  base: {
    'Семейный 40': 4000000,
    'МиниДом 36': 3200000,
    'Дом Куб 30': 2900000
  },
  foundation: {
    'Свайно-винтовой': 0,
    'МЗЛФ': 150000,
    'Плита': 350000
  },
  options: {
    'Терраса': 250000,
    'Кровля металло-черепица': 120000,
    'Панорамные окна': 200000
  }
};
const houseType = document.getElementById('houseType');
const foundationType = document.getElementById('foundationType');
const optionCheckboxes = document.querySelectorAll('.options__grid input[type="checkbox"]');
const totalPriceEl = document.getElementById('totalPrice');
function formatPrice(num) {
  return new Intl.NumberFormat('ru-RU').format(num) + ' ₽';
}
function calculateTotal() {
  const base = calculatorPrices.base[houseType.value] || 0;
  const foundation = calculatorPrices.foundation[foundationType.value] || 0;
  const optionsSum = Array.from(optionCheckboxes).filter(cb => cb.checked)
    .reduce((acc, cb) => acc + (calculatorPrices.options[cb.value] || 0), 0);
  const total = base + foundation + optionsSum;
  animatePrice(total);
  return total;
}
function animatePrice(value) {
  totalPriceEl.classList.add('animate');
  totalPriceEl.textContent = formatPrice(value);
  setTimeout(() => totalPriceEl.classList.remove('animate'), 500);
}
if (houseType && foundationType && totalPriceEl) {
  [houseType, foundationType].forEach(select => {
    select.addEventListener('change', calculateTotal);
  });
  optionCheckboxes.forEach(cb => cb.addEventListener('change', calculateTotal));
  calculateTotal();
}

// --- Проекты: Галереи и модальные окна ---
const projectsData = {
  'semeiny-40': {
    title: 'Семейный 40',
    gallery: [
      'https://i.postimg.cc/Wz2s1pkQ/photo-5467925983140117215-y-1.jpg',
      'https://i.postimg.cc/NjVGkw3H/photo-5467372104157624624-y.jpg',
      'https://i.postimg.cc/7hmwGv1b/photo-5467925983140117216-y.jpg',
      'https://i.postimg.cc/02kN8nGb/photo-5467372104157624620-y.jpg',
      'https://i.postimg.cc/rmG8TRK1/photo-5467925983140117214-y.jpg',
      'https://i.postimg.cc/qBXRVS3P/photo-5467372104157624619-y.jpg',
      'https://i.postimg.cc/J0q4NH8r/photo-5467372104157624617-y.jpg',
      'https://i.postimg.cc/NFYj27WC/photo-5467372104157624618-y.jpg',
      'https://i.postimg.cc/X7sYX5xx/photo-5467372104157624621-y.jpg',
      'https://i.postimg.cc/dVDtC0xF/photo-5467372104157624622-y.jpg',
      'https://i.postimg.cc/Hx1pF9sW-/photo-5467452858132723456-y.jpg',
      'https://i.postimg.cc/ZR6qqDDy/photo-5467372104157624616-y.jpg'
]
  },
  'minidom-36': {
    title: 'МиниДом 36',
    gallery: [
      'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443011784094118439_x.jpg?raw=true',
      'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443140577278424523_y.jpg?raw=true',
      'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443140577278424536_y.jpg?raw=true',
      'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443140577278424533_x.jpg?raw=true',
      'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443140577278424534_x.jpg?raw=true',
      'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443140577278424527_y.jpg?raw=true',
      'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443140577278424522_y.jpg?raw=true',
      'https://github.com/domdom610/Svoy-Dom/blob/main/images/photo_5443140577278424521_y.jpg?raw=true'
    ]
  },
  'dom-kub-30': {
    title: 'Дом Куб 30',
    gallery: [
      'https://i.postimg.cc/htSQ5xtq/photo-5467925983140117240-y.jpg',
      'https://i.postimg.cc/x8MNW3m9/photo-5467372104157624690-y.jpg',
      'https://i.postimg.cc/66vZ2tmF/photo-5467372104157624691-y.jpg',
      'https://i.postimg.cc/KvhMtCXj/photo-5467925983140117239-y.jpg',
      'https://i.postimg.cc/Ssw-zTvJZ/photo-5467372104157624692-y-1.jpg',
      'https://i.postimg.cc/Y94WxHqG/photo-5467372104157624689-y.jpg'
    ]
  }
};

const projectModal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalGallery = document.getElementById('modalGallery');

window.openProjectModal = function (key) {
  const data = projectsData[key];
  if (!data) return;
  modalTitle.textContent = data.title;
  modalGallery.innerHTML = data.gallery.map(src =>
    <img src="${src}" alt="${data.title}" loading="lazy">
  ).join('');
  projectModal.classList.add('show');
};
window.closeProjectModal = function () {
  projectModal.classList.remove('show');
};

// --- Контактная форма и модальное окно ---
const contactModal = document.getElementById('contactModal');
const calculatorDataInput = document.getElementById('calculatorData');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

window.openContactModal = function () {
  // Save текущие данные калькулятора
  if (calculatorDataInput && houseType && foundationType) {
    const data = {
      houseType: houseType.value,
      foundation: foundationType.value,
      options: Array.from(optionCheckboxes).filter(cb => cb.checked).map(cb => cb.value),
      total: calculateTotal()
    };
    calculatorDataInput.value = JSON.stringify(data);
  }
  contactModal.classList.add('show');
};
window.closeContactModal = function () {
  contactModal.classList.remove('show');
};

// --- Отправка формы ---
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    try {
      // Обычный POST-запрос; action может быть любой сервис почтовой обработки/скрипт
      const resp = await fetch(contactForm.action || '#', { method: 'POST', body: formData });
      if (resp.ok) {
        showFormStatus('Спасибо! Мы скоро свяжемся с вами.', 'success');
        contactForm.reset();
        setTimeout(closeContactModal, 2000);
      } else {
        throw new Error();
      }
    } catch (error) {
      showFormStatus('Не удалось отправить. Попробуйте позже.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
    }
  });
}
function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = status status--${type};
  formStatus.classList.remove('hidden');
  setTimeout(() => formStatus.classList.add('hidden'), 5000);
}
// --- Escape для закрытия модалок, закрывает меню ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.show').forEach(modal =>
      modal.classList.remove('show')
    );
    if (navbarMenu && navbarMenu.classList.contains('active')) {
      navbarToggle.click();
    }
  }
});

// --- Foreman button: поддержка клавиатуры ---
const foremanButton = document.querySelector('.foreman-button');
if (foremanButton) {
  foremanButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openContactModal();
    }
  });
}

// --- Анимация появления по словам (H1) ---
document.addEventListener('DOMContentLoaded', () => {
  const animatedText = document.querySelector('.animated-text');
  if (animatedText) {
    const words = animatedText.querySelectorAll('.word');
    words.forEach((word, i) => {
      word.style.animationDelay = (i * 0.25) + 's';
      word.classList.add('animate-word');
    });
  }
});
