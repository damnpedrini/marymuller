class NavbarManager {
    constructor(navbarSelector, menuIconSelector) {
        this.navbar = document.querySelector(navbarSelector);
        this.menuIcon = document.querySelector(menuIconSelector);
    }

    // SRP: Responsável por checar o estado da navbar e ajustar o menu icon
    updateMenuIconPosition() {
        if (this.isNavbarActive()) {
            this.setMenuIconFixed();
        } else {
            this.setMenuIconAbsolute();
        }
    }

    // SRP: Verifica se a navbar está ativa
    isNavbarActive() {
        return this.navbar.classList.contains('ativo');
    }

    // SRP: Define a posição do menu icon como fixed
    setMenuIconFixed() {
        this.menuIcon.style.position = 'fixed';
    }

    // SRP: Define a posição do menu icon como absolute
    setMenuIconAbsolute() {
        this.menuIcon.style.position = 'absolute';
    }

    // OCP: Facilita a extensão de eventos sem modificar o código existente
    init() {
        this.updateMenuIconPosition();

        this.navbar.addEventListener('transitionend', () => {
            this.updateMenuIconPosition();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // DIP: Dependência é injetada, facilitando o teste e a manutenção
    const navbarManager = new NavbarManager('.navbar', '.menu-icon');
    navbarManager.init();
});


// SRP: Classe para gerenciar a rolagem suave
class ScrollManager {
    constructor(duration = 900) {
        this.duration = duration;
    }

    // Executa o scroll suave até a posição especificada
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
        }, 1000 / 60);
    }
}

// SRP: Classe para lidar com links de navegação e eventos de clique
class LinkHandler {
    constructor(linksSelector, scrollManager, offset = 0) {
        this.links = document.querySelectorAll(linksSelector);
        this.scrollManager = scrollManager;
        this.offset = offset; // Offset para considerar cabeçalhos fixos ou margens
    }

    // Inicializa o gerenciamento de eventos para cada link
    init() {
        this.links.forEach((link) => {
            link.addEventListener("click", (event) => this.scrollToSection(event));
        });
    }

    // Manipula o evento de clique e executa a rolagem suave
    scrollToSection(event) {
        event.preventDefault();
        const targetElement = event.target;
        const distanceFromTheTop = this.getDistanceFromTheTop(targetElement) - this.offset;
        this.scrollManager.smoothScrollTo(0, distanceFromTheTop);
    }

    // Calcula a distância do topo até o elemento alvo
    getDistanceFromTheTop(element) {
        const id = element.getAttribute("href");
        return document.querySelector(id).offsetTop;
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
    const scrollManager = new ScrollManager();
    const linkHandler = new LinkHandler('.navbar a[href^="#"]', scrollManager, 0); // O valor 90 representa o offset
    linkHandler.init();
});

