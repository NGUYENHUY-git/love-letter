const envelope = document.getElementById("envelope");
const hearts   = envelope.querySelector(".hearts");
const openBtn  = document.getElementById("open");
const closeBtn = document.getElementById("close");
let timer;

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  h.style.left = 40 + Math.random() * 200 + "px";
  h.style.animationDuration = 2 + Math.random() * 1.5 + "s";
  hearts.appendChild(h);
  setTimeout(() => h.remove(), 4000);
}

function openEnvelope() {
  envelope.classList.remove("close");
  envelope.classList.add("open");
  openBtn.classList.add("active");
  if (window.heartBurst) heartBurst();
  closeBtn.classList.remove("active");
  clearInterval(timer);
  // hearts start once the letter has slid out
  setTimeout(() => {
    spawnHeart();
    timer = setInterval(spawnHeart, 350);
    setTimeout(() => clearInterval(timer), 2500);   // short burst
  }, 900);
}

function closeEnvelope() {
  clearInterval(timer);
  envelope.classList.remove("open");
  envelope.classList.add("close");
  closeBtn.classList.add("active");
  openBtn.classList.remove("active");
}

openBtn.addEventListener("click", openEnvelope);
closeBtn.addEventListener("click", closeEnvelope);
