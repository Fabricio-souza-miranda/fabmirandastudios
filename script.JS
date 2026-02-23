document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.mobile-menu-icon');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.getElementById('navbar');

    // Abre e fecha o menu mobile
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Trava o scroll do fundo quando o menu está aberto
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'initial';
        });

        // Fecha o menu ao clicar em um link (importante para navegação interna)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuIcon.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'initial';
            });
        });
    }

    // Efeito de scroll na navbar (muda borda/fundo ao rolar)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});