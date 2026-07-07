(function () {
  'use strict';

  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const sidebar = document.getElementById('sidebar');
  const navIcons = document.querySelectorAll('.nav-icon');
  const backToTop = document.getElementById('backToTop');
  const readingProgress = document.getElementById('readingProgress');
  const revealElements = document.querySelectorAll('.scroll-reveal');

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

  // ============================================================
  // 双向滚动动画：从下方滑入出现，向上滚出消失
  // ============================================================

  function initRevealAnimation() {
    if (!('IntersectionObserver' in window)) {
      // 降级：直接显示所有元素
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const el = entry.target;

          if (entry.isIntersecting) {
            // 元素进入视口：从下方滑入出现
            el.classList.remove('is-hidden');
            el.classList.add('is-visible');
          } else {
            // 元素离开视口：判断方向，添加上滑消失效果
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            // 如果元素在视口上方（向上滚出顶部），或者已经完全滚过
            if (rect.bottom < 0 || rect.top < viewportHeight / 2) {
              el.classList.remove('is-visible');
              el.classList.add('is-hidden');
            }
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  initRevealAnimation();

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
