// Notebook Logic
const Notebook = {
    data: [
        {
            img: "images/1.jpg", caption: "Aaj bhi tu cute lag rahi hai 😭💗",
            shayari: "Tu special hai… aur bohot zyada special hai 💓\n\nTeri smile aate hi sab kuch bright ho jata hai ✨\n\nBas aise hi hamesha khush rehna… okay? 🌷"
        },
        {
            img: "images/2.jpg", caption: "Teri vibe hi alag hai ✨",
            shayari: "Teri presence hi kaafi hai…\nmere din ko better banane ke liye 💗\n\nTu jab saath hoti hai na,\nsab simple aur sukoon wala lagta hai ✨"
        },
        {
            img: "images/3.jpg", caption: "Tu = comfort 💓",
            shayari: "Tere bina mood thoda sa off lagta hai 😶‍🌫️\nAur tere saath… sab perfect sa 💓\n\nTu jaisi hai na… waise hi best hai 🌸"
        },
        {
            img: "images/4.jpg", caption: "My fav smile 🌷",
            shayari: "Tu jab hasti hai na,\nmeri favorite feeling ban jaati hai 😭💗\n\nTera smile genuinely priceless hai ✨\n\nAaj ek baar… smile kar de 🥺"
        },
        {
            img: "images/5.jpg", caption: "Special always 💗",
            shayari: "Main lucky hoon jo tu meri life me hai 🌷\n\nTere hone se hi kaafi kuch acha lagta hai 💓\n\nThank you… for being you 💞"
        },
        {
            img: "images/6.jpg", caption: "Precious person 💓",
            shayari: "Tu meri life ka woh part hai\njisko main kabhi lose nahi karna chahta 💗\n\nBas aise hi… mere paas rehna ✨\n\nYou are truly precious 💓"
        }
    ],
    currentIndex: 0, // spreadIndex
    mobileStep: 0,   // 0: Photo, 1: Shayari (Mobile only)

    init() {
        const openBtn = document.getElementById("open-notebook-btn");
        const nextBtn = document.getElementById("next-page");
        const prevBtn = document.getElementById("prev-page");
        const closeBtn = document.getElementById("close-notebook-btn");
        const restartBtn = document.getElementById("restart-btn");

        this.renderPages();

        openBtn.addEventListener("click", () => this.open());
        nextBtn.addEventListener("click", () => this.next());
        prevBtn.addEventListener("click", () => this.prev());
        closeBtn.addEventListener("click", () => this.close());
        restartBtn.addEventListener("click", () => location.reload());

        window.addEventListener('resize', () => this.updateUI());
    },

    renderPages() {
        const container = document.getElementById("nb-pages");
        container.innerHTML = "";

        const holesHtml = `
            <div class="binding-strip">
                ${Array(8).fill('<div class="hole"></div>').join('')}
            </div>
        `;

        this.data.forEach((item, index) => {
            const page = document.createElement("div");
            page.className = "nb-page";
            page.id = `nb-page-${index}`;
            page.style.zIndex = this.data.length - index;

            page.innerHTML = `
                <div class="nb-page-front">
                    ${holesHtml}
                    <div class="nb-page-inner">
                        <img src="${item.img}" class="nb-img" alt="photo">
                        <div class="nb-caption">${item.caption}</div>
                        <div class="nb-footer" id="nb-footer-front-${index}">${index + 1}/6</div>
                    </div>
                </div>
                <div class="nb-page-back">
                    ${holesHtml}
                    <div class="nb-page-inner">
                        <div class="nb-shayari">${item.shayari}</div>
                        <div class="nb-footer" id="nb-footer-back-${index}">${index + 1}/6</div>
                    </div>
                </div>
            `;
            container.appendChild(page);
        });
    },

    open() {
        this.currentIndex = 0;
        this.mobileStep = 0;

        document.getElementById("notebook-cover").classList.add("hide");
        document.getElementById("notebook-container").classList.remove("hide");
        document.getElementById("nb-controls").classList.remove("hide");

        this.data.forEach((_, i) => {
            const p = document.getElementById(`nb-page-${i}`);
            if (p) {
                p.classList.remove('flipped');
                const inners = p.querySelectorAll('.nb-page-inner');
                inners.forEach(inner => inner.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right', 'slide-active'));
            }
        });

        this.updateUI();
    },

    next() {
        const isMobile = window.innerWidth <= 480;
        const isLast = isMobile ?
            (this.currentIndex === 5 && this.mobileStep === 1) :
            (this.currentIndex >= 6);
        if (isLast) return;

        if (isMobile) {
            this.triggerSlideAnimation('next');
        } else {
            if (this.currentIndex < this.data.length) {
                const page = document.getElementById(`nb-page-${this.currentIndex}`);
                if (page) page.classList.add("flipped");
                this.currentIndex++;
            }
            this.updateUI();
        }
    },

    prev() {
        const isMobile = window.innerWidth <= 480;

        if (isMobile) {
            if (this.currentIndex === 0 && this.mobileStep === 0) {
                this.backToCover();
                return;
            }
            this.triggerSlideAnimation('prev');
        } else {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                const page = document.getElementById(`nb-page-${this.currentIndex}`);
                if (page) page.classList.remove("flipped");
            }
            this.updateUI();
        }
    },

    triggerSlideAnimation(direction) {
        const activePage = document.querySelector('.nb-page.active');
        if (!activePage) {
            this.updateState(direction);
            this.updateUI();
            return;
        }

        const currentInner = activePage.classList.contains('mobile-shayari') ? 
            activePage.querySelector('.nb-page-back .nb-page-inner') : 
            activePage.querySelector('.nb-page-front .nb-page-inner');

        if (currentInner) {
            currentInner.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
        }

        setTimeout(() => {
            if (currentInner) {
                currentInner.classList.remove('slide-out-left', 'slide-out-right');
            }
            
            this.updateState(direction);
            this.updateUI();

            const newActivePage = document.querySelector('.nb-page.active');
            if (newActivePage) {
                const newInner = newActivePage.classList.contains('mobile-shayari') ? 
                    newActivePage.querySelector('.nb-page-back .nb-page-inner') : 
                    newActivePage.querySelector('.nb-page-front .nb-page-inner');
                
                if (newInner) {
                    newInner.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
                    newInner.offsetHeight; // trigger reflow
                    newInner.classList.add('slide-active');
                    
                    setTimeout(() => {
                        newInner.classList.remove('slide-in-right', 'slide-in-left', 'slide-active');
                    }, 500);
                }
            }
        }, 300);
    },

    updateState(direction) {
        if (direction === 'next') {
            if (this.mobileStep === 0) {
                this.mobileStep = 1;
            } else {
                this.currentIndex++;
                this.mobileStep = 0;
            }
        } else {
            if (this.mobileStep === 1) {
                this.mobileStep = 0;
            } else {
                this.currentIndex--;
                this.mobileStep = 1;
            }
        }
    },

    updateUI() {
        const isMobile = window.innerWidth <= 480;
        const nextBtn = document.getElementById("next-page");
        const prevBtn = document.getElementById("prev-page");
        const closeBtn = document.getElementById("close-notebook-btn");
        const navHint = document.getElementById("nav-hint");

        const isLast = isMobile ?
            (this.currentIndex === 5 && this.mobileStep === 1) :
            (this.currentIndex >= 6);

        if (isMobile) {
            this.data.forEach((_, i) => {
                const p = document.getElementById(`nb-page-${i}`);
                if (i === this.currentIndex) {
                    p.classList.add('active');
                    if (this.mobileStep === 1) {
                        p.classList.add('mobile-shayari');
                    } else {
                        p.classList.remove('mobile-shayari');
                    }
                } else {
                    p.classList.remove('active', 'mobile-shayari');
                }
            });

            const subTitle = this.mobileStep === 0 ? "(Photo)" : "(Shayari)";
            const footerId = this.mobileStep === 0 ? `nb-footer-front-${this.currentIndex}` : `nb-footer-back-${this.currentIndex}`;
            const footer = document.getElementById(footerId);
            if (footer) {
                footer.textContent = `${this.currentIndex + 1}/6 ${subTitle}`;
            }
        } else {
            this.data.forEach((_, i) => {
                const p = document.getElementById(`nb-page-${i}`);
                if (p) p.classList.remove('active', 'mobile-shayari');
                const f = document.getElementById(`nb-footer-front-${i}`);
                const b = document.getElementById(`nb-footer-back-${i}`);
                if (f) f.textContent = `${i + 1}/6`;
                if (b) b.textContent = `${i + 1}/6`;
            });
        }

        // Navigation UI Visibility
        if (isLast) {
            if (nextBtn) nextBtn.classList.add("hide");
            if (prevBtn) prevBtn.classList.add("hide");
            if (navHint) navHint.classList.add("hide");
            if (closeBtn) closeBtn.classList.remove("hide");
        } else {
            if (nextBtn) nextBtn.classList.remove("hide");
            if (prevBtn) prevBtn.classList.remove("hide");
            if (navHint) navHint.classList.remove("hide");
            if (closeBtn) closeBtn.classList.add("hide");

            if (isMobile) {
                if (prevBtn) prevBtn.style.visibility = (this.currentIndex === 0 && this.mobileStep === 0) ? "hidden" : "visible";
            } else {
                if (prevBtn) prevBtn.style.visibility = (this.currentIndex === 0) ? "hidden" : "visible";
            }
            if (nextBtn) nextBtn.style.visibility = "visible";
        }
    },

    backToCover() {
        document.getElementById("notebook-container").classList.add("hide");
        document.getElementById("nb-controls").classList.add("hide");
        document.getElementById("notebook-cover").classList.remove("hide");
        this.currentIndex = 0;
        this.mobileStep = 0;
    },

    close() {
        document.getElementById("notebook-container").classList.add("hide");
        document.getElementById("nb-controls").classList.add("hide");
        document.getElementById("close-notebook-btn").classList.add("hide");

        const cover = document.getElementById("notebook-cover");
        cover.classList.remove("hide");
        cover.classList.add("fadeIn");

        document.getElementById("cover-text").textContent = "Please… mere saath aise hi rehna 💓";
        if (document.getElementById("open-notebook-btn")) {
            document.getElementById("open-notebook-btn").classList.add("hide");
        }
        if (document.querySelector(".open-hint")) {
            document.querySelector(".open-hint").classList.add("hide");
        }
        document.getElementById("restart-btn").classList.remove("hide");
    }
};

window.initNotebook = () => Notebook.init();
