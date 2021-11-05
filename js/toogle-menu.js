"use strict";
document.querySelector(".btn-menu").addEventListener("click", toggleMenu);

function toggleMenu() {
    document.querySelector(".navigation").classList.toggle("show");
}