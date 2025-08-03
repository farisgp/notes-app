const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  static async apiRequest(url, options = {}) {
    try {
      const response = await fetch(url, options);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error during fetch request:", error);
      showUserFeedback("An error occurred. Please try again later.", true);
      throw error;
    }
  }
  static async getAllNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);
      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw new Error(responseJson.message);
      }

      if (!Array.isArray(responseJson.data)) {
        throw new Error("Data catatan tidak valid.");
      }

      return responseJson.data;
    } catch (error) {
      NotesApi.showResponseMessage(error.message);
      return [];
    }
  }

  static async archiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: "POST",
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message);
    }

    return response.json();
  }

  static async getArchivedNotes() {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    const responseJson = await response.json();

    if (responseJson.status !== "success") {
      throw new Error(responseJson.message);
    }

    return responseJson.data;
  }

  static async unarchiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: "POST",
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message);
    }

    return response.json();
  }

  static async searchNotes(query) {
    try {
      const response = await fetch(
        `${BASE_URL}/notes/search?title=${encodeURIComponent(query)}`,
      );
      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw new Error(responseJson.message);
      }

      if (!Array.isArray(responseJson.data)) {
        throw new Error("Data hasil pencarian tidak valid.");
      }

      const notes = responseJson.data || [];

      return notes;
    } catch (error) {
      NotesApi.showResponseMessage(error.message);
      return [];
    }
  }

  static async addNote({ title, body }) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      const json = await response.json();
      if (json.status !== "success") throw new Error(json.message);

      return json.data;
    } catch (error) {
      NotesApi.showResponseMessage(error.message);
      throw error;
    }
  }

  static async deleteNote(noteId) {
    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
      });

      const json = await response.json();
      if (json.status !== "success") throw new Error(json.message);

      return json.message;
    } catch (error) {
      NotesApi.showResponseMessage(error.message);
      throw error;
    }
  }

  static showResponseMessage(message = "Check your internet connection") {
    alert(message);
  }
}

export default NotesApi;
