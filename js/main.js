(function () {
  'use strict';

  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const sidebar = document.getElementById('sidebar');
  const navIcons = document.querySelectorAll('.nav-icon');
  const backToTop = document.getElementById('backToTop');
  const readingProgress = document.getElementById('readingProgress');
  const fadeElements = document.querySelectorAll('.fade-in');

  // 移动端导航切换
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('open');
      sidebar.classList.toggle('open');
    });
  }

  // 点击导航后关闭移动端菜单
  navIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        mobileNavToggle.classList.remove('open');
      }
    });
  });

  // 点击页面其他地方关闭移动端菜单
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !mobileNavToggle.contains(e.target)
    ) {
      sidebar.classList.remove('open');
      mobileNavToggle.classList.remove('open');
    }
  });

  // 回到顶部
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 更新阅读进度条和回到顶部按钮
  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (readingProgress) {
      readingProgress.style.width = progress + '%';
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollTop > 400);
    }
  }

  window.addEventListener('scroll', updateScrollUI);

  // 导航高亮与滚动监听
  const sections = document.querySelectorAll('.section');

  function updateActiveNav() {
    let current = '';
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navIcons.forEach(icon => {
      icon.classList.toggle('active', icon.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // 淡入动画（IntersectionObserver）
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // 降级：直接显示
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // 键盘支持：ESC 关闭移动端菜单
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      mobileNavToggle.classList.remove('open');
    }
  });

  // 初始化
  updateScrollUI();
  updateActiveNav();
})();
