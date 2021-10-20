const cards = document.querySelectorAll(".card");

for (var card of cards) {
  const mainLink = card.querySelector(".main-link");
  const clickableElements = Array.from(card.querySelectorAll(".clickable"));

  clickableElements.forEach((ele) =>
    ele.addEventListener("click", (e) => e.stopPropagation())
  );

  card.addEventListener("click", (event) => {
    const noTextSelected = !window.getSelection().toString();

    if (noTextSelected) {
      mainLink.click();
    }
  });
}
