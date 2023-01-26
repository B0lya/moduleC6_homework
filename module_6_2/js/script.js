const buttonNode = document.querySelector(".button");

buttonNode.addEventListener("click", () => {
  alert(`
  Размер экрана: ${window.screen.width}x${window.screen.height}
  Размер вьюпорта (c полосой прокрутки): ${document.documentElement.clientWidth}x${document.documentElement.clientHeight}
  Размер вьюпорта (без полосы прокрутки): ${window.innerWidth}x${window.innerHeight}
  `);
});



