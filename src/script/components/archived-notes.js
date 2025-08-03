class ArchivedNotes extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._notes = null; // null = data belum datang
    this._style = document.createElement("style");
    this._container = document.createElement("div");
    this._container.className = "list";
  }

  connectedCallback() {
    this._updateStyle();
    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.appendChild(this._container);
    this.render();
  }

  set notes(value) {
    this._notes = value; // Jangan pakai || [] agar bisa deteksi null
    this.render();
  }

  get notes() {
    return this._notes;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: grid;
      }
      .list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .empty {
        grid-column: 1 / -1;
        text-align: center;
        font-style: italic;
      }
    `;
  }

  render() {
    this._container.innerHTML = "";

    if (this._notes === null) {
      // Data belum datang → tidak render apa pun
      return;
    }

    if (this._notes.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Belum ada catatan arsip.";
      empty.classList.add("empty");
      this._container.appendChild(empty);
      return;
    }

    this._notes.forEach((note) => {
      const noteItem = document.createElement("notes-item");
      noteItem.note = note;
      this._container.appendChild(noteItem);
    });
  }
}

customElements.define("archived-notes", ArchivedNotes);
