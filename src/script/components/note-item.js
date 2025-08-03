class NotesItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  set note(value) {
    this._note = value;

    // Render ulang
    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        animation: fadeIn 0.4s ease;
      }

      .card {
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgb(0, 102, 255);
      }

      .notes-info {
        padding: 1.5rem;
        display: grid;
        gap: 0.8rem;
      }

      .notes-info__title h2 {
        font-size: 1.3rem;
        color: #2c3e50;
        margin: 0;

        white-space: normal;
        overflow-wrap: break-word;
        word-break: break-word;
      }

      .notes-info__description p {
        font-size: 1rem;
        color: #555;
        line-height: 1.6;

        white-space: normal;
        overflow-wrap: break-word;
        word-break: break-word;
      }
      .notes-info__button {
        display: grid;
        grid-template-columns: repeat(2, auto);
        gap: 12px;
        margin-top: 1rem;
        justify-content: start; /* kiri bawah */
      }
      .btn-delete {
        background-color: rgb(207, 28, 28);
        color: white;
        border: none;
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 0.9rem;
        text-transform: uppercase;
        cursor: pointer;
        width: fit-content;
      }

      .btn-delete:hover {
        background-color:rgb(255, 0, 0);
      }
      .btn-archive {
        background-color: rgb(141, 117, 117);
        color: white;
        border: none;
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 0.9rem;
        text-transform: uppercase;
        cursor: pointer;
        width: fit-content;
      }

      .btn-archive:hover {
        background-color:rgb(163, 153, 153);
      }
    `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    const isArchived = this._note.archived;

    this._shadowRoot.innerHTML += `
      <style>${this._style.textContent}</style>
      <div class="card">
        <div class="notes-info">
          <div class="notes-info__title">
            <h2>${this._note.title}</h2>
          </div>
          <div class="notes-info__description">
            <p>${this._note.body.replace(/\n/g, "<br>")}</p>
          </div>
          <div class="notes-info__button">
            <button class="btn-delete" data-id="${this._note.id}">
              Hapus
            </button>
            <button class="btn-archive" data-id="${this._note.id}">
              ${isArchived ? "Unarchive" : "Archive"}
            </button>
          </div>
        </div>
      </div>
    `;

    this._shadowRoot
      .querySelector(".btn-delete")
      ?.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-note", {
            detail: { id: this._note.id },
            bubbles: true,
            composed: true,
          }),
        );
      });

    this._shadowRoot
      .querySelector(".btn-archive")
      ?.addEventListener("click", () => {
        const eventName = isArchived ? "unarchive-note" : "archive-note";
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: { id: this._note.id },
            bubbles: true,
            composed: true,
          }),
        );
      });
  }
}

customElements.define("notes-item", NotesItem);
