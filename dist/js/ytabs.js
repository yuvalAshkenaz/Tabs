/*! y-tabs v2.0.3
* 19/11/2026
* Yuval Ashkenazi
* https://y-tools.dooble.us/ytabs/
*/

// Tabs
document.querySelectorAll('.tabs-group').forEach((group, groupIndex) => {
	// groupIndex starts at 0, so add 1 to start from group1
	const currentGroupNum = groupIndex + 1;

	const tabsList = group.querySelector('.tabs-list');
	const tabs = group.querySelectorAll('.tabs-btn');
	const panels = group.querySelectorAll('.tabs-div');

	// Add role to the main ul
	if (tabsList) tabsList.setAttribute('role', 'tablist');

	tabs.forEach((btn, index) => {
		const currentTabNum = index + 1;
		const parentLi = btn.closest('li');
		const panel = panels[index];

		// Create dynamic IDs (for example: group1-tab-btn-1)
		const btnId = `group${currentGroupNum}-tab-btn-${currentTabNum}`;
		const panelId = `group${currentGroupNum}-tab-div-${currentTabNum}`;

		// 1. Set accessibility attributes for the button
		btn.id = btnId;
		btn.setAttribute('role', 'tab');
		btn.setAttribute('aria-controls', panelId);

		// 2. Set accessibility attributes for the content (panel)
		if (panel) {
			panel.id = panelId;
			panel.setAttribute('role', 'tabpanel');
			panel.setAttribute('aria-labelledby', btnId);
		}

		// 3. Activate the first tab by default (hide the rest) + roving tabindex
		if (index === 0) {
			parentLi.classList.add('active');
			btn.setAttribute('aria-selected', 'true');
			btn.tabIndex = 0;
			if (panel) panel.classList.add('active');
		} else {
			parentLi.classList.remove('active');
			btn.setAttribute('aria-selected', 'false');
			btn.tabIndex = -1;
			if (panel) panel.classList.remove('active');
		}

		// 4. Click listener for each tab
		btn.addEventListener('click', () => {
			// Reset all tabs in the current group
			group.querySelectorAll('.tabs-list li').forEach(li => li.classList.remove('active'));
			tabs.forEach(t => {
				t.setAttribute('aria-selected', 'false');
				t.tabIndex = -1;
			});
			panels.forEach(p => p.classList.remove('active'));

			// Activate the clicked tab and panel
			parentLi.classList.add('active');
			btn.setAttribute('aria-selected', 'true');
			btn.tabIndex = 0;
			if (panel) panel.classList.add('active');

			btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });

			// When switching to another tab - focus moves to the first link inside the panel
			// of the matching panel, and does not stay on the tab button itself
			const firstLink = panel ? panel.querySelector('a[href]') : null;
			if (firstLink) {
				firstLink.focus();
			} else {
				btn.focus();
			}
		});
	});

	if (tabsList) initScroll(tabsList);
});

// Scrollable tabs list with arrows and drag
function initScroll(list) {
	const nav = document.createElement('div');
	nav.className = 'tabs-nav';
	list.parentNode.insertBefore(nav, list);
	nav.appendChild(list);

	const makeArrow = (cls, label) => {
		const b = document.createElement('button');
		b.type = 'button';
		b.className = 'tabs-arrow ' + cls;
		b.setAttribute('aria-label', label);
		b.hidden = true;
		nav.appendChild(b);
		return b;
	};
	const prev = makeArrow('tabs-arrow--prev', 'Scroll tabs back');
	const next = makeArrow('tabs-arrow--next', 'Scroll tabs forward');
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const isRtl = () => getComputedStyle(list).direction === 'rtl';

	const update = () => {
		const pos = Math.abs(list.scrollLeft);
		const max = list.scrollWidth - list.clientWidth;
		nav.classList.toggle('is-rtl', isRtl());
		prev.hidden = pos < 2;
		next.hidden = max < 2 || pos > max - 2;
		nav.classList.toggle('has-prev', !prev.hidden);
		nav.classList.toggle('has-next', !next.hidden);
	};
	const scrollStep = dir => list.scrollBy({
		left: dir * (isRtl() ? -1 : 1) * list.clientWidth * 0.8,
		behavior: reduceMotion.matches ? 'auto' : 'smooth'
	});

	prev.addEventListener('click', () => scrollStep(-1));
	next.addEventListener('click', () => scrollStep(1));
	list.addEventListener('scroll', update, { passive: true });
	window.addEventListener('resize', update);
	window.addEventListener('load', update);
	if (window.ResizeObserver) new ResizeObserver(update).observe(list);
	update();

	// Mouse drag
	let startX = 0, startScroll = 0, dragging = false, moved = false;
	list.addEventListener('mousedown', e => {
		if (e.button !== 0 || list.scrollWidth <= list.clientWidth) return;
		dragging = true;
		moved = false;
		startX = e.clientX;
		startScroll = list.scrollLeft;
	});
	document.addEventListener('mousemove', e => {
		if (!dragging) return;
		const dx = e.clientX - startX;
		if (!moved && Math.abs(dx) < 5) return;
		moved = true;
		list.classList.add('is-dragging');
		list.scrollLeft = startScroll - dx;
	});
	document.addEventListener('mouseup', () => {
		if (!dragging) return;
		dragging = false;
		list.classList.remove('is-dragging');
		setTimeout(() => { moved = false; }, 0);
	});
	list.addEventListener('click', e => {
		if (!moved) return;
		moved = false;
		e.stopPropagation();
		e.preventDefault();
	}, true);
}

// Keyboard Navigation
document.addEventListener('keydown', e => {
	if (e.keyCode !== 37 && e.keyCode !== 39) return;

	const active = document.activeElement;
	// Do not interfere with text fields - arrow keys move the caret there
	if (['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName) || active.isContentEditable) return;

	const isTabBtn = active.classList.contains('tabs-btn');
	const panelAncestor = active.closest('.tabs-div');
	if (!isTabBtn && !panelAncestor) return;

	const group = (isTabBtn ? active : panelAncestor).closest('.tabs-group');
	const parentUl = group ? group.querySelector('.tabs-list') : active.closest('.tabs-list');
	if (!parentUl) return;
	const allLis = Array.from(parentUl.querySelectorAll('li'));

	let currentIndex;
	if (isTabBtn) {
		currentIndex = allLis.indexOf(active.closest('li'));
	} else {
		const panels = Array.from(group.querySelectorAll('.tabs-div'));
		currentIndex = panels.indexOf(panelAncestor);
	}
	if (currentIndex === -1) return;

	const forward = (e.keyCode === 39) !== (getComputedStyle(parentUl).direction === 'rtl');
	const nextIndex = (currentIndex + (forward ? 1 : -1) + allLis.length) % allLis.length;
	allLis[nextIndex].querySelector('.tabs-btn').click();
});

/* =========================================
   Copy Code Functionality
   ========================================= */
function copyCode(buttonElement) {
    let codeElement;
    
    if (buttonElement.parentElement.classList.contains('source-header')) {
        codeElement = buttonElement.parentElement.nextElementSibling.querySelector('.code-snippet');
    } else {
        codeElement = buttonElement.parentElement.querySelector('.code-snippet');
    }
    
    if (codeElement) {
        const textToCopy = codeElement.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = buttonElement.textContent;
            buttonElement.textContent = "Copied! ✔";
            buttonElement.classList.add('copied');
            
            setTimeout(() => {
                buttonElement.textContent = originalText;
                buttonElement.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Error copying text: ', err);
        });
    }
}