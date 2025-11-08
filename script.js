// Validações por campo:
// - #nome: permite apenas letras (incluindo acentuadas) e espaços
// - #descricao: permite qualquer texto (sem restrições)
// - #preco: permite apenas dígitos e um ponto decimal, com até 2 casas
document.addEventListener('DOMContentLoaded', function () {
    const nome = document.getElementById('nome');
    const descricao = document.getElementById('descricao');
    const preco = document.getElementById('preco');
    const form = document.querySelector('form');

    // --- NOME: apenas letras e espaços ---
    if (nome) {
        // Ao digitar: remove caracteres que não sejam letras ou espaços
        nome.addEventListener('input', function () {
            // aceita letras latinas com acentos e espaços — bloqueia números
            this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
        });

        // Colagem: sanitize
        nome.addEventListener('paste', function (e) {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            this.value = text.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
        });
    }

    // --- PRECO: números e ponto, até 2 casas ---
    if (preco) {
        // Normaliza enquanto digita
        preco.addEventListener('input', function () {
            let v = this.value;
            // troca vírgula por ponto
            v = v.replace(/,/g, '.');
            // remove caracteres inválidos
            v = v.replace(/[^0-9.]/g, '');
            // permite apenas um ponto
            const parts = v.split('.');
            if (parts.length > 1) {
                const integer = parts.shift();
                let fraction = parts.join('');
                fraction = fraction.slice(0, 2); // limita 2 casas
                v = integer + '.' + fraction;
            }
            this.value = v;
        });

        // Previne teclas indesejadas (ex: 'e', '+', '-')
        preco.addEventListener('keydown', function (e) {
            const nav = ['Backspace','Tab','ArrowLeft','ArrowRight','Delete','Home','End'];
            if (nav.includes(e.key)) return;
            const allowed = /[0-9.,]/;
            if (!allowed.test(e.key)) {
                e.preventDefault();
            }
            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                e.preventDefault();
            }
        });

        // Colagem: sanitize
        preco.addEventListener('paste', function (e) {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const sanitized = text.replace(/,/g, '.').replace(/[^0-9.]/g, '');
            const parts = sanitized.split('.');
            let out = parts[0] || '';
            if (parts.length > 1) {
                const fraction = parts.slice(1).join('').slice(0,2);
                out = out + '.' + fraction;
            }
            this.value = out;
        });
    }

    // --- Validação no submit ---
    form.addEventListener('submit', function (e) {
        // valida nome (se presente)
        if (nome) {
            const nomeVal = nome.value.trim();
            if (nomeVal === '' || /[^A-Za-zÀ-ÿ\s]/.test(nomeVal)) {
                e.preventDefault();
                alert('Por favor, insira um nome válido (apenas letras e espaços).');
                nome.focus();
                return;
            }
        }

        // valida preco (se presente)
        if (preco) {
            const val = preco.value.trim();
            if (val === '' || isNaN(Number(val))) {
                e.preventDefault();
                alert('Por favor, insira um preço válido (somente números e até 2 casas decimais).');
                preco.focus();
                return;
            }
        }

        // descricao: sem validação extra (livre)
    });
});