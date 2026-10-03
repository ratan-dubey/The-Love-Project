// App State & Routing
const App = {
    currentPage: 'page1',
    playing: false,
    
    init() {
        this.createParticles();
        this.loadPage('page1');
        this.bindGlobalEvents();
    },

    createParticles() {
        const particles = document.getElementById("particles");
        for (let i = 0; i < 26; i++) {
            const p = document.createElement("div");
            p.className = "p";
            p.style.left = Math.random() * 100 + "vw";
            p.style.animationDuration = (6 + Math.random() * 7) + "s";
            p.style.animationDelay = (-Math.random() * 8) + "s";
            p.style.opacity = (0.2 + Math.random() * 0.4);
            p.style.transform = `scale(${0.6 + Math.random() * 1.2})`;
            particles.appendChild(p);
        }
    },

    async loadPage(page) {
        try {
            const response = await fetch(`pages/${page}.html`);
            const html = await response.text();
            const app = document.getElementById('app');
            app.innerHTML = html;
            this.currentPage = page;
            this.bindPageEvents(page);
        } catch (err) {
            console.error("Failed to load page:", err);
        }
    },

    bindGlobalEvents() {
        const musicBtn = document.getElementById("musicBtn");
        const bgm = document.getElementById("bgm");
        bgm.volume = 0.4;

        musicBtn.addEventListener("click", async () => {
            try {
                if (!this.playing) {
                    bgm.play();
                    this.playing = true;
                    musicBtn.classList.add("on");
                } else {
                    bgm.pause();
                    this.playing = false;
                    musicBtn.classList.remove("on");
                }
            } catch (e) { console.log("Audio play error", e); }
        });
    },

    bindPageEvents(page) {
        if (page === 'page1') {
            const mailbox = document.getElementById("mailbox");
            mailbox.addEventListener("click", () => {
                if (navigator.vibrate) navigator.vibrate(40);
                const overlay = document.getElementById("overlay");
                const env = document.getElementById("env");
                
                overlay.classList.add("show");
                setTimeout(() => env.classList.add("opened"), 300);
                this.triggerScatter(overlay);
                
                setTimeout(() => {
                    overlay.classList.remove("show");
                    env.classList.remove("opened");
                    this.loadPage('page2');
                }, 1800);
            });
        } 
        else if (page === 'page2') {
            const toPhotos = document.getElementById("toPhotos");
            this.typeWriter();
            toPhotos.addEventListener("click", () => {
                this.loadPage('page3');
            });
        }
        else if (page === 'page3') {
            // Notebook logic is handled in js/notebook.js
            // We call it here if it's already loaded or use a global init
            if (window.initNotebook) {
                window.initNotebook();
            }
        }
    },

    triggerScatter(container) {
        for (let i = 0; i < 18; i++) {
            const b = document.createElement("div");
            b.className = "burst";
            const dx = (Math.random() - 0.5) * 280;
            const rot = (Math.random() - 0.5) * 150;
            b.style.setProperty('--dx', dx + 'px');
            b.style.setProperty('--rot', rot + 'deg');
            b.style.left = "50%"; b.style.top = "50%";
            b.style.animationDelay = (Math.random() * 0.2) + "s";
            container.appendChild(b);
            setTimeout(() => b.remove(), 1500);
        }
    },

    typeWriter() {
        const typed = document.getElementById("typed");
        if (!typed) return;
        const text = "Just a sweet bestie surprise… no drama, only smiles 💓";
        typed.textContent = ""; let i = 0;
        const t = setInterval(() => {
            typed.textContent += text[i]; i++;
            if (i >= text.length) clearInterval(t);
        }, 30);
    }
};

window.onload = () => App.init();
