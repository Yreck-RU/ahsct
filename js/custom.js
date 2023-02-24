function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();


//===========================================================================================================================================


const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}

};

if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let i = 0; i < menuArrows.length; i++) {
			const menuArrow = menuArrows[i];
			menuArrow.addEventListener("click", function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}
} else {
	document.body.classList.add('_pc');
}

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}

const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}

//===============================================================================================================================================================



// Динамический адаптив  -----------------------------------------------------------------------------

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

// Динамический адаптив  -----------------------------------------------------------------------------



// Спойлеры ---------------------------------------------------------------------------------

const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});

	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});

			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}

let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration)
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

// Спойлеры ---------------------------------------------------------------------------------

// Язык в шапке ---------------------------------------------------------------------------------

const LangvigButton =  document.querySelector('.index-block-eng__header');
const LangvigWrapper =  document.querySelector('.index-block-eng');
const LangvigBody =  document.querySelector('.index-block-eng__wrapper');

if (LangvigButton) {
	LangvigButton.addEventListener( 'click', (e) => {
		LangvigWrapper.classList.toggle('_active');
	});
	document.addEventListener( 'click', (e) => {
		let withinBoundaries = e.composedPath().includes(LangvigBody);
		let withinBoundaries2 = e.composedPath().includes(LangvigButton);

		if ( ! withinBoundaries && ! withinBoundaries2) {
			LangvigWrapper.classList.remove('_active');
		}
	})
}

// Язык в шапке ---------------------------------------------------------------------------------


//Выподающие списки ===================================================================================

const selectSingles = document.querySelectorAll('.__select');

if (selectSingles) {
	for (let i = 0; i < selectSingles.length; i++) {
		const selectSingle = selectSingles[i];
		const selectSingle_title = selectSingle.querySelector('.__select__title');
		const selectSingle_labels = selectSingle.querySelectorAll('.__select__label');

		// Toggle menu
		selectSingle_title.addEventListener('click', () => {
			if ('active' === selectSingle.getAttribute('data-state')) {
				//selectSingle.setAttribute('data-state', '');
			} else {
				selectSingle.setAttribute('data-state', 'active');
				if (selectSingle_title.classList.contains('__select__title-countries')) {

				}
			}
		});
		document.addEventListener( 'click', (e) => {
			let withinBoundaries = e.composedPath().includes(selectSingle_title);
			let withinBoundaries2 = e.composedPath().includes(selectSingle_labels);

			if (selectSingle.classList.contains('__select_countries') && selectSingle.getAttribute('data-state', 'active')) {
				if ( ! withinBoundaries && ! withinBoundaries2) {
					selectSingle.setAttribute('data-state', '');
				}
				//alert("k");
				if (!selectSingle_title.value) {
					//alert("k");
					let titleImg = document.querySelector('.select-title__img-countries');
					let plugVisual = document.querySelector('.__select__plud-visual').src;
					let plug = document.querySelector('.__select__plud').src;
					titleImg.style.backgroundImage = `url(${plug})`;
					if (selectSingle.getAttribute('data-state', '')) {
						titleImg.style.backgroundImage = `url(${plug})`;
					} else {
						titleImg.style.backgroundImage = `url(${plugVisual})`;
					}
				}
			} else {
				if ( ! withinBoundaries && ! withinBoundaries2) {
					selectSingle.setAttribute('data-state', '');
				}
			}
			
		})

		// Close when click to option
		for (let i = 0; i < selectSingle_labels.length; i++) {
			let selectSingle_label = selectSingle_labels[i];
			selectSingle_labels[i].addEventListener('click', (evt) => {
				if (selectSingle_title.classList.contains('__select__title-countries')) {
					//Изменение текста
					let contentText = selectSingle_label.querySelector('.__select__content-text').textContent.replace(/ +/g, ' ').trim();
					selectSingle_title.value = contentText;

					//Картинки
					let contentImg = selectSingle_label.querySelector('.__select__content-img').src;
					let titleImg = document.querySelector('.select-title__img-countries');
					titleImg.style.backgroundImage = `url(${contentImg})`;
				} else {
					selectSingle_title.value = evt.target.textContent;
					console.log(evt.target.textContent);
				}
				selectSingle.setAttribute('data-state', '');
			});
		}
	}
}

//=====================================================================================================








// Убирания плэйсхолдера при фокусе ---------------------------------------------------------------------------------

const Forms =  document.querySelectorAll('._input-placeholder');

if (Forms) {
	for (let i = 0; i < Forms.length; i++) {
		let Form = Forms[i];
		let FormPlaceholder = Form.placeholder;

		Form.addEventListener("focus", function (e) {
			Form.placeholder = "";
		});
		Form.addEventListener("blur", function (e) {
			Form.placeholder = FormPlaceholder;
		});
	}
}

// Убирания плэйсхолдера при фокусе ---------------------------------------------------------------------------------





//====================================================================================================================
const inputFiles =  document.querySelectorAll('.input-file');

if (inputFiles) {
	for (let i = 0; i < inputFiles.length; i++) {
		let inputFile = inputFiles[i];
		let inputFileWrapper = inputFile.querySelector('.field__wrapper');

		function showFile(input) {
			let file = inputFile.querySelector('.field');
			inputFileWrapper.classList.add('_active');
			/*if (inputFileWrapper) {
				alert("k");
			}*/
			//alert(`File name: ${file.name}`); // например, my.png
			//alert(`Last modified: ${file.lastModified}`); // например, 1552830408824
		}
	}
}



//====================================================================================================================


// =================================================================
// Начало - "Табы"
// =================================================================

const blokTabs = document.querySelector('.blok-tabs');
if (blokTabs) {
	const LineBody = document.querySelector('.blok-tabs__line');
	window.addEventListener('resize', function(event){
		let TabeLink = document.querySelector('.Tabe-link__active');
		let Line = document.querySelector('.blok-tabs__line-span');
		let TabeLinkWidtw = TabeLink.offsetWidth;
		let TabeLinkLeft =  TabeLink.getBoundingClientRect().left;
		let LineBodyLeft = LineBody.getBoundingClientRect().left;
		TabeLinkWidtw + 20;
		SumLeft = TabeLinkLeft - LineBodyLeft;
		//elem.getBoundingClientRect().left;
		Line.style.width = `${TabeLinkWidtw + 30}px`;
		Line.style.left = `${SumLeft - 15}px`;
	});
	document.querySelectorAll('.Tabe-link').forEach((item) =>
		item.addEventListener('click', function (e) {
			e.preventDefault();
			const id = e.target.getAttribute('href').replace('#', '');

			document.querySelectorAll('.Tabe-link').forEach(
				(child) => child.classList.remove('Tabe-link__active')
			);
			document.querySelectorAll('.Tabe-content').forEach(
				(child) => child.classList.remove('Tabe-content__active')
			);

			item.classList.add('Tabe-link__active');
			document.getElementById(id).classList.add('Tabe-content__active');

			let TabeLink = document.querySelector('.Tabe-link__active');
			let Line = document.querySelector('.blok-tabs__line-span');
			let TabeLinkWidtw = TabeLink.offsetWidth;
			let TabeLinkLeft =  TabeLink.getBoundingClientRect().left;
			let LineBodyLeft = LineBody.getBoundingClientRect().left;
			TabeLinkWidtw + 20;
			SumLeft = TabeLinkLeft - LineBodyLeft;
			//elem.getBoundingClientRect().left;
			Line.style.width = `${TabeLinkWidtw + 0}px`;
			Line.style.left = `${SumLeft - 0}px`;
			//alert(TabeLinkWidtw);
		})
	);

	document.querySelector('.Tabe-link').click();
}


// =================================================================
// Конец - "Табы"
// =================================================================


var container = document.querySelector(".symbols");

if ( container) {
	var str = container.innerHTML;

	for(var i = 0; i < str.length; i++)
	{
	  var e = document.createElement("span");
	  e.innerHTML = str[i];
	  container.appendChild(e);
	}

	let inAniItemNamber = 0;
	for (var i = 0; i < str.length; i++) {
		//console.log(document.getElementsByClassName('symbols')[0].children[i].innerHTML);
		inAniItemNamber = inAniItemNamber + 0.13;
		let inAniItem = document.getElementsByClassName('symbols')[0].children[i];
		//console.log(inAniItem);
		//inAniItem.style.transition-delay = `${inAniItemNamber}s`;
		inAniItem.style.transitionDelay = `${inAniItemNamber}s`;
		//document.getElementsByClassName('symbols')[0].children[i].innerHTML.style.animationDelay = `${inAniItemNamber}s`;
	}

	let timerinAniItem = setTimeout(function tick() {
		container.classList.add('_active');
	}, 1);
}

/*const inAniItems =  document.querySelectorAll('.in-ani-item');
let inAniItemNamber = 0;
if (inAniItems) {
	//alert("k");
	for (let i = 0; i < inAniItems.length; i++) {
		//alert("k5");
		let inAniItem = inAniItems[i];
		let inAniItemDecorTop = inAniItem.querySelector('.in-ani-item__decor_top');
		let inAniItemDecorBottom = inAniItem.querySelector('.in-ani-item__decor_bottom');
		inAniItemNamber = inAniItemNamber + 0.20;
		inAniItem.style.animationDelay = `${inAniItemNamber}s`;
		inAniItemDecorTop.style.animationDelay = `${inAniItemNamber}s`;
		inAniItemDecorBottom.style.animationDelay = `${inAniItemNamber}s`;
	}
}

let timerinAniItem = setTimeout(function tick() {
	const AniItemWrapper =  document.querySelector('.index-animation');
	if (AniItemWrapper) {
		//AniItemWrapper.classList.add('_active');
		AniItemWrapper.classList.remove('_active');
	}
}, 3700);*/





if (document.querySelector(".mySwiperOne")) {
	var swiper = new Swiper(".mySwiperOne", {
		slidesPerView: 4,
		spaceBetween: 30,

		navigation: {
			nextEl: ".swiperOne-button-next",
			prevEl: ".swiperOne-button-prev",
		},

		breakpoints: {
			320: {
				slidesPerView: 1,
			},
			767: {
				slidesPerView: 3,
			},
			1064: {
				slidesPerView: 4,
			},
		},
	});
}


const el = document.querySelector(".buttton-scrol");

if (el) {
	el.addEventListener("click", function (e) {
		document.body.scrollIntoView({behavior: "smooth"});
	});

	//если скролить хедер блюрится 
	window.addEventListener('scroll', function(){
		var heder = document.querySelector(".header");
		heder.classList.toggle('sticky', window.scrollY > 60);
		if (window.scrollY < 60) {
			//console.log(window.scrollY);
			let headerBottom = document.querySelector(".header-bottom").style.top = `${60 - window.scrollY}px`;;
		}
		el.classList.toggle('_active', window.scrollY > 0);
	});
}









//==============================================================================================================================
//Анимаця при скроле - начало
//==============================================================================================================================

const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0 && window.innerWidth > 1064) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll () {
		for (let index = 0; index < animItems.length; index++) {
			//console.log(getCoords(animItems[index]));
			const animItem = animItems[index];
			const animItemOffset = offset(animItem).top;

			window.addEventListener('scroll', function(){
				if ((animItemOffset - ((window.innerWidth / 100) * 25)) < window.scrollY) {
					animItem.classList.add('_anim-active');
				}
			});
			if ((animItemOffset - ((window.innerWidth / 100) * 25)) < window.scrollY) {
				animItem.classList.add('_anim-active');
			}
		}

	}
	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollleft = window.pageXOffset || document.documentElement.scrollleft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollleft}
	}
	animOnScroll();
}

//==============================================================================================================================
//Анимаця при скроле - конец
//==============================================================================================================================



//==============================================================================================================================
//Анимаця working-mechanism - начало
//==============================================================================================================================

const workingMechanism = document.querySelector('.working-mechanism');

if (workingMechanism) {
	const workingMechanismBloks = document.querySelectorAll('.working-mechanism-blok');
	let workingMechanismNumber = 0;
	for (let i = 0; i < workingMechanismBloks.length; i++) {
		let workingMechanismBlok = workingMechanismBloks[i];
		workingMechanismNumber = workingMechanismNumber + 0.2;
		workingMechanismBlok.style.transitionDelay = `${workingMechanismNumber}s`;
	}
}

//==============================================================================================================================
//Анимаця working-mechanism - конец
//==============================================================================================================================




//==============================================================================================================================
//Анимаця working-mechanism - начало
//==============================================================================================================================

const disablityStatus = document.querySelector('.disablity-status');

if (disablityStatus) {
	const disablityStatuBloks = document.querySelectorAll('.disablity-status-header__blok');
	let disablityStatuNumber = 0;
	for (let i = 0; i < disablityStatuBloks.length; i++) {
		let disablityStatuBlok = disablityStatuBloks[i];
		disablityStatuNumber = disablityStatuNumber + 0.2;
		disablityStatuBlok.style.transitionDelay = `${disablityStatuNumber}s`;
	}
	let timerinAniItem = setTimeout(function tick() {
		disablityStatus.classList.add('_active');
	}, 500);
}

//==============================================================================================================================
//Анимаця working-mechanism - конец
//==============================================================================================================================