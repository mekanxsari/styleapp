document.querySelectorAll('.like-btn, .like-btn-capsula').forEach(function (elem) {
    elem.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.src.endsWith("images/heart.png")) {
            this.src = "images/heart-active.png";
        } else {
            this.src = "images/heart.png";
        }
    };
});

function toggleDropdown(el) {
    document.querySelectorAll('.custom-dropdown').forEach(d => {
        if (d !== el) d.classList.remove('open');
    });
    el.classList.toggle('open');
}

function selectOption(option) {
    const dropdown = option.closest('.custom-dropdown');
    dropdown.querySelector('.selected').innerText = option.innerText;
    dropdown.classList.remove('open');
    const url = option.getAttribute('data-url');
    if (url) {
        window.location.href = url;
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
    }
});

function shakeInput(input) {
    input.classList.add('shake');
    input.addEventListener('animationend', function handler() {
        input.classList.remove('shake');
        input.removeEventListener('animationend', handler);
    });
}

window.addEventListener('DOMContentLoaded', function () {
    var password = document.getElementById('password');
    var passwordSecond = document.getElementById('password-second');
    var loginSubmit = document.getElementById('login-submit');
    if (password) password.style.display = 'none';
    if (passwordSecond) passwordSecond.style.display = 'none';
    if (loginSubmit) loginSubmit.style.display = 'none';
});

var loginContinue = document.getElementById('login-continue');
if (loginContinue) {
    loginContinue.addEventListener('click', function () {
        var nameInput = document.getElementById('name');
        var emailInput = document.getElementById('email');
        var valid = true;

        if (!nameInput.value) {
            shakeInput(nameInput);
            nameInput.focus();
            valid = false;
        }

        if (!emailInput.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            shakeInput(emailInput);
            if (valid) emailInput.focus();
            valid = false;
        }

        if (!valid) return;

        nameInput.style.display = 'none';
        emailInput.style.display = 'none';
        loginContinue.style.display = 'none';

        var password = document.getElementById('password');
        var passwordSecond = document.getElementById('password-second');
        var loginSubmit = document.getElementById('login-submit');
        if (password) password.style.display = 'block';
        if (passwordSecond) passwordSecond.style.display = 'block';
        if (loginSubmit) loginSubmit.style.display = 'block';
    });
}

var form = document.querySelector('.form');
if (form) {
    form.addEventListener('submit', function (e) {
        var passwordInput = document.getElementById('password');
        var passwordSecondInput = document.getElementById('password-second');
        var valid = true;

        if (passwordInput && !passwordInput.value) {
            shakeInput(passwordInput);
            passwordInput.focus();
            valid = false;
        }
        if (passwordSecondInput && !passwordSecondInput.value) {
            shakeInput(passwordSecondInput);
            if (valid) passwordSecondInput.focus();
            valid = false;
        }

        if (passwordInput && passwordSecondInput && passwordInput.value && passwordSecondInput.value && passwordInput.value !== passwordSecondInput.value) {
            shakeInput(passwordInput);
            shakeInput(passwordSecondInput);
            passwordInput.value = '';
            passwordSecondInput.value = '';
            passwordInput.focus();
            valid = false;
        }
        if (!valid) e.preventDefault();
    });
}

var loginNext = document.getElementById('login-next');
if (loginNext) {
    loginNext.addEventListener('click', function () {
        var emailInput = document.getElementById('email');
        if (!emailInput.value) {
            shakeInput(emailInput);
            emailInput.focus();
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            shakeInput(emailInput);
            emailInput.focus();
            return;
        }

        emailInput.style.display = 'none';
        loginNext.style.display = 'none';
        var password = document.getElementById('password');
        var loginSubmit = document.getElementById('login-submit');
        if (password) password.style.display = 'block';
        if (loginSubmit) loginSubmit.style.display = 'block';
    });
}

function switchTab(tab) {
    var containers = [
        {tab: 'items', container: '.item-container', title: 'Предметы', quantity: '8'},
        {tab: 'outfits', container: '.outfits-container', title: 'Аутфиты', quantity: '8'},
        {tab: 'capsulas', container: '.capsules-container', title: 'Капсулы', quantity: '3'}
    ];
    containers.forEach(function(obj) {
        var cont = document.querySelector(obj.container);
        var tabElem = document.getElementById(obj.tab);
        if (cont) cont.classList.add('tab-hidden');
        if (tabElem) tabElem.parentElement.classList.remove('active');
    });

    var selected = containers.find(obj => obj.tab === tab);
    if (selected) {
        var cont = document.querySelector(selected.container);
        var tabElem = document.getElementById(tab);
        if (cont) cont.classList.remove('tab-hidden');
        if (tabElem) tabElem.parentElement.classList.add('active');
        var titleElem = document.getElementById('tab-title');
        var qtyElem = document.getElementById('tab-quantity');
        if (titleElem) titleElem.innerText = selected.title;
        if (qtyElem) qtyElem.innerText = selected.quantity;
    }
}

['items', 'outfits', 'capsulas'].forEach(function(tab) {
    var tabElem = document.getElementById(tab);
    if (tabElem) {
        tabElem.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(tab);
        });
    }
});