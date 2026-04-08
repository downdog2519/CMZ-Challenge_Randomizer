// nav.js — Handles main navigation and page switching

export function showPage(pageId) {
    document.querySelectorAll('.main-page').forEach(p => p.classList.add('hidden'));
    const page = document.getElementById(pageId);
    if (!page) return;
    page.classList.remove('hidden');
    page.dispatchEvent(new CustomEvent('cmz:show'));
}

export function setupNav() {
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => showPage(btn.getAttribute('data-nav')));
    });
    document.querySelectorAll('[data-nav-back]').forEach(btn => {
        btn.addEventListener('click', () => showPage('mainMenu'));
    });
}
