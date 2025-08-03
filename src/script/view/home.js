import Utils from "../utils.js";
import NotesApi from "../data/remote/note-api.js";
import "../components/archived-notes.js";
import Swal from "sweetalert2";
import { gsap } from "gsap";
import "../components/loading-spinner.js";

const home = () => {
  const loadingIndicator = document.querySelector("loading-spinner");
  const searchFormElement = document.querySelector("search-bar");
  const btnAddNote = document.querySelector("#btn-add-note");
  const addNoteForm = document.querySelector("add-note-form");
  const notesList = document.querySelector("notes-list");
  const archivedNotes = document.querySelector("archived-notes");
  const btnToggleArchive = document.querySelector("#btn-toggle-archive");

  const clubListContainerElement = document.querySelector(
    "#notesListContainer",
  );
  const clubLoadingElement = document.querySelector("search-loading");
  const clubListElement = clubListContainerElement.querySelector("notes-list");

  let isArchiveShown = false;

  async function loadNotes() {
    try {
      showLoading();
      let notes = [];

      if (isArchiveShown) {
        notes = await NotesApi.getArchivedNotes();
        archivedNotes.notes = notes;
      } else {
        notes = await NotesApi.getAllNotes();
        renderNotes(notes);
        showNotesList();
      }
    } catch (error) {
      console.error("Gagal mengambil data catatan dari API:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal memuat catatan",
        text: "Periksa koneksi internet atau coba lagi nanti.",
      });
    } finally {
      hideLoading();
    }
  }

  function renderNotes(notes) {
    Utils.emptyElement(notesList);
    notes.forEach((note) => {
      const noteItem = document.createElement("notes-item");
      noteItem.note = note;
      notesList.appendChild(noteItem);
    });
  }

  btnToggleArchive.addEventListener("click", async () => {
    isArchiveShown = !isArchiveShown;

    if (isArchiveShown) {
      showLoading();
      gsap.to(notesList, {
        opacity: 0,
        y: -30,
        duration: 0.3,
        onComplete: async () => {
          notesList.style.display = "none";
          notesList.hidden = true;

          archivedNotes.hidden = false;
          archivedNotes.style.display = "block";
          await loadNotes();

          gsap.fromTo(
            archivedNotes,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4 },
          );

          btnToggleArchive.textContent = "Active Note";
        },
      });
    } else {
      showLoading();
      gsap.to(archivedNotes, {
        opacity: 0,
        y: -30,
        duration: 0.3,
        onComplete: async () => {
          archivedNotes.style.display = "none";
          archivedNotes.hidden = true;

          notesList.hidden = false;
          notesList.style.display = "block";
          await loadNotes();

          gsap.fromTo(
            notesList,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4 },
          );

          btnToggleArchive.textContent = "Archive Note";
        },
      });
    }
  });

  btnAddNote.addEventListener("click", () => {
    if (addNoteForm.hasAttribute("hidden")) {
      addNoteForm.removeAttribute("hidden");
      gsap.from(addNoteForm, {
        opacity: 0,
        y: -50,
        duration: 0.4,
        ease: "back.out(3.0)",
      });
      btnAddNote.textContent = "Close Form";
      btnAddNote.classList.remove("btn-add-note");
      btnAddNote.classList.add("btn-close-note");
    } else {
      gsap.to(addNoteForm, {
        opacity: 0,
        y: -30,
        duration: 0.3,
        ease: "back.in(3.0)",
        onComplete: () => {
          addNoteForm.setAttribute("hidden", "");
          gsap.set(addNoteForm, { clearProps: "all" });
        },
      });
      btnAddNote.textContent = "Add Note";
      btnAddNote.classList.remove("btn-close-note");
      btnAddNote.classList.add("btn-add-note");
    }
  });

  addNoteForm.addEventListener("add-note", async (event) => {
    const { title, body } = event.detail;
    try {
      showLoading();
      await NotesApi.addNote({ title, body });
      await new Promise((resolve) => setTimeout(resolve, 500));
      await Swal.fire("Berhasil!", "Catatan berhasil ditambahkan.", "success");
      await loadNotes();
      btnAddNote.classList.add("btn-add-note");
    } catch (error) {
      await Swal.fire("Gagal!", "Catatan gagal ditambahkan.", "error");
      btnAddNote.classList.add("btn-add-note");
    } finally {
      hideLoading();
    }
    addNoteForm.hidden = true;
    btnAddNote.textContent = "Add Note";
  });

  async function handleDeleteNote(event) {
    const { id } = event.detail;

    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Catatan tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (result.isConfirmed) {
      try {
        showLoading();
        await NotesApi.deleteNote(id);
        await new Promise((resolve) => setTimeout(resolve, 500));
        Swal.fire("Dihapus!", "Catatan berhasil dihapus.", "success");
        await loadNotes();
      } catch (err) {
        Swal.fire("Gagal", "Tidak dapat menghapus catatan.", "error");
      } finally {
        hideLoading();
      }
    }
  }

  async function handleArchiveNote(event) {
    const { id } = event.detail;

    const result = await Swal.fire({
      title: "Arsipkan Catatan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, arsipkan",
    });

    if (result.isConfirmed) {
      try {
        showLoading();
        await NotesApi.archiveNote(id);
        await new Promise((resolve) => setTimeout(resolve, 500));
        Swal.fire("Berhasil!", "Catatan telah diarsipkan.", "success");
        await loadNotes();
      } catch {
        Swal.fire("Gagal!", "Gagal mengarsipkan catatan.", "error");
      } finally {
        hideLoading();
      }
    }
  }

  async function handleUnarchiveNote(event) {
    const { id } = event.detail;

    const result = await Swal.fire({
      title: "Kembalikan Catatan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, kembalikan",
    });

    if (result.isConfirmed) {
      try {
        showLoading();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await NotesApi.unarchiveNote(id);
        await loadNotes();
        Swal.fire("Berhasil!", "Catatan telah dikembalikan.", "success");
      } catch {
        Swal.fire("Gagal!", "Gagal mengembalikan catatan.", "error");
      } finally {
        hideLoading();
      }
    }
  }

  async function showNotes(query) {
    try {
      // showLoading();
      const result = await NotesApi.searchNotes(query);
      displayResult(result);
      showNotesList();
    } catch {
      Swal.fire("Gagal!", "Pencarian gagal dijalankan.", "error");
    } finally {
      hideLoading();
    }
  }

  const onSearchHandler = (event) => {
    event.preventDefault();

    const { query } = event.detail;
    showNotes(query);
  };

  const displayResult = (notes) => {
    const noteElements = notes.map((note) => {
      const el = document.createElement("notes-item");
      el.note = note;
      return el;
    });

    Utils.emptyElement(clubListElement);
    clubListElement.append(...noteElements);

    gsap.fromTo(
      noteElements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      },
    );
  };

  // const showLoading = () => {
  //   Array.from(clubListContainerElement.children).forEach(Utils.hideElement);
  //   Utils.showElement(clubLoadingElement);
  // };

  async function showLoading() {
    loadingIndicator.style.display = "flex";
    loadingIndicator.hidden = false;
    gsap.fromTo(
      loadingIndicator,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
    );
  }

  async function hideLoading() {
    gsap.to(loadingIndicator, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        loadingIndicator.hidden = true;
        loadingIndicator.style.display = "none";
      },
    });
  }

  const showNotesList = () => {
    Array.from(clubListContainerElement.children).forEach(Utils.hideElement);
    Utils.showElement(clubListElement);
  };

  searchFormElement.addEventListener("search", (event) => {
    event.preventDefault();
    const { query } = event.detail;
    showNotes(query);
  });

  notesList.addEventListener("delete-note", handleDeleteNote);
  archivedNotes.addEventListener("delete-note", handleDeleteNote);
  notesList.addEventListener("archive-note", handleArchiveNote);
  archivedNotes.addEventListener("unarchive-note", handleUnarchiveNote);
  searchFormElement.addEventListener("search", onSearchHandler);

  archivedNotes.hidden = true;
  loadNotes();
  // showNotesList();
};

export default home;
