document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.mobile-menu-icon');
    const navLinks = document.querySelector('.nav-links');

    // Abre e fecha menu ao clicar no hambúrguer
    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Impede scroll do fundo quando menu está aberto
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'initial';
    });

    // Fecha o menu automaticamente ao clicar em qualquer link
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'initial';
        });
    });
});