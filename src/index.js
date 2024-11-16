const ta = document.getElementById("ta"); // ta as in (t)ext(a)rea

ta.addEventListener("change", () =>  {
  console.log(
    `Text area changed, new value:\n\
    ${ta.value}`
  );
});

//#region load/save text
document.addEventListener("DOMContentLoaded", () => {
  loadText();
});

function saveText() {
  const text = ta.value;

  fetch("/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: text }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Text saved successfully!");
      } else {
        alert("Failed to save text.");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function loadText() {
  fetch("/load")
    .then((response) => response.json())
    .then((data) => {
      ta.value = data.content || "";
    })
    .catch((error) => console.error("Error loading text:", error));
}
//#endregion

function clearText() {
  ta.value = "";
}
