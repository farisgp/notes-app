class Utils {
  static emptyElement(element) {
    element.innerHTML = "";
  }

  static showElement(element) {
    element.style.display = "grid";
    element.hidden = false;
  }

  static hideElement(element) {
    element.style.display = "none";
    element.hidden = true;
  }

  static isValidInteger(newValue) {
    return Number.isNaN(newValue) || Number.isFinite(newValue);
  }
  // static showLoading(element) {
  //   element.style.display = 'block';
  // }

  // static hideLoading(element) {
  //   element.style.display = 'none';
  // }
  // static sleep(response = null) {
  //   // Proses async ini seharusnya tidak memiliki kemungkinan gagal.
  //   return new Promise((resolve) =>
  //     setTimeout(() => {
  //       resolve(response);
  //     }, 3000),
  //   );
  // }
}

export default Utils;
