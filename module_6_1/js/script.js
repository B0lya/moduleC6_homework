const buttonNode = document.querySelector(".button");
const unfilledIconNode = document.querySelector(".unfilled");
const filledIconNode = document.querySelector(".filled")

buttonNode.addEventListener("click", () => {
  unfilledIconNode.classList.toggle("hidden");
  filledIconNode.classList.toggle("hidden");
});