const taxSwitch = document.getElementById("switchCheckDefault");

if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    const taxInfo = document.getElementsByClassName("tax-info");

    for (let info of taxInfo) {
      info.style.display =
        info.style.display === "inline" ? "none" : "inline";
    }
  });
}