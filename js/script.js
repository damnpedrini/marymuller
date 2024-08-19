// SRP: Classe para gerenciar o estado da Navbar
class NavbarManager {
    constructor(navbarSelector, menuIconSelector) {
        this.navbar = document.querySelector(navbarSelector);
        this.menuIcon = document.querySelector(menuIconSelector);
    }

    updateMenuIconPosition() {
        if (this.isNavbarActive()) {
            this.setMenuIconPosition('fixed');
        } else {
            this.setMenuIconPosition('absolute');
        }
    }

    isNavbarActive() {
        return this.navbar.classList.contains('ativo');
    }

    setMenuIconPosition(position) {
        this.menuIcon.style.position = position;
    }

    init() {
        this.updateMenuIconPosition();
        this.navbar.addEventListener('transitionend', () => this.updateMenuIconPosition());
    }
}

// SRP: Classe para gerenciar a rolagem suave
class ScrollManager {
    constructor(duration = 900) {
        this.duration = duration;
    }

    smoothScrollTo(endX, endY) {
        const startX = window.scrollX || window.pageXOffset;
        const startY = window.scrollY || window.pageYOffset;
        const distanceX = endX - startX;
        const distanceY = endY - startY;
        const startTime = new Date().getTime();

        const timer = setInterval(() => {
            const time = new Date().getTime() - startTime;
            const newX = Ease.easeInOutQuart(time, startX, distanceX, this.duration);
            const newY = Ease.easeInOutQuart(time, startY, distanceY, this.duration);
            if (time >= this.duration) {
                clearInterval(timer);
            }
            window.scroll(newX, newY);
        }, 1000 / 90);
    }
}

// SRP: Classe para lidar com links de navegação e eventos de clique
class LinkHandler {
    constructor(linksSelector, scrollManager, offset = 0) {
        this.links = document.querySelectorAll(linksSelector);
        this.scrollManager = scrollManager;
        this.offset = offset;
    }

    init() {
        this.preventAutoScrollOnLoad(); // Evita rolagem automática ao carregar a página
        this.links.forEach((link) => {
            link.addEventListener("click", (event) => this.handleLinkClick(event));
        });
    }

    handleLinkClick(event) {
        event.preventDefault();
        const targetElement = event.target;
        const targetId = targetElement.getAttribute("href").substring(1);

        if (targetId && document.getElementById(targetId)) {
            const distanceFromTheTop = this.getDistanceFromTheTop(targetId) - this.offset;
            this.scrollManager.smoothScrollTo(0, distanceFromTheTop);
        }
    }

    getDistanceFromTheTop(targetId) {
        // Adicionando a altura do topo da página para compensar a posição
        const elementTop = document.getElementById(targetId).getBoundingClientRect().top;
        const scrollY = window.scrollY || window.pageYOffset;
        return elementTop + scrollY;  // Calcula a distância mais precisa do elemento
    }

    preventAutoScrollOnLoad() {
        if (window.location.hash) {
            window.scrollTo(0, 0);
            setTimeout(() => {
                window.scrollTo(0, 0); // Garante que o navegador não pule para o ID automaticamente
            }, 1);
        }
    }
}

// SRP: Classe para definir as funções de easing
class Ease {
    static easeInOutQuart(time, from, distance, duration) {
        if ((time /= duration / 2) < 1) return (distance / 2) * time * time * time * time + from;
        return (-distance / 2) * ((time -= 2) * time * time * time - 2) + from;
    }
}

// DIP: Injeção de dependência ao criar instâncias das classes
document.addEventListener('DOMContentLoaded', () => {
    const navbarManager = new NavbarManager('.navbar', '.menu-icon');
    navbarManager.init();

    const scrollManager = new ScrollManager();
    const linkHandler = new LinkHandler('.navbar a[href^="#"]', scrollManager, 90); // Offset ajustado para 90px
    linkHandler.init();

    // JavaScript para o funcionamento do botão da navbar responsiva
    var menuIcon = document.querySelector('.menu-icon');
    var navbar = document.querySelector('.navbar');

    menuIcon.addEventListener('click', () => {
        if (navbar.classList.contains('ativo')) {
            navbar.classList.remove('ativo');
            document.querySelector('.menu-icon img').src = 'img/menu.png';
        } else {
            navbar.classList.add('ativo');
            document.querySelector('.menu-icon img').src = 'img/close.png';
        }
    });

    document.querySelectorAll('.navbar a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('ativo');
            document.querySelector('.menu-icon img').src = 'img/menu.png';
        });
    });
});
