class AddNoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();

      const title = this.shadowRoot.querySelector("#title").value.trim();
      const body = this.shadowRoot.querySelector("#body").value.trim();

      if (!title || !body) {
        alert("Judul dan isi catatan harus diisi!");
        return;
      }

      const newNote = {
        id: `notes-${Date.now()}`,
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
      };

      this.dispatchEvent(
        new CustomEvent("add-note", {
          detail: newNote,
          bubbles: true,
          composed: true,
        }),
      );

      e.target.reset();
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        form {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        input, textarea {
          padding: 8px;
          font-size: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        button {
          padding: 8px 12px;
          background-color: cornflowerblue;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          text-transform: uppercase;
        }
        button:hover {
          background-color: #4485ff;
        }
      </style>
      <form novalidate>
        <label for="title">Judul Catatan</label>
        <input id="title" name="title" type="text" required minlength="3" placeholder="Masukkan judul..." />
        <label for="body">Isi Catatan</label>
        <textarea id="body" name="body" rows="5" required placeholder="Tulis isi catatan..."></textarea>
        <button style="background-color:rgb(35, 165, 100);" type="submit">Submit</button>
      </form>
    `;
  }
}

customElements.define("add-note-form", AddNoteForm);
