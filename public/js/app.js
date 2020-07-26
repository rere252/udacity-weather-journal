class JournalService {
  async postEntry(jsonData) {
    try {
      const resp = await fetch('/newEntry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getAllEntries() {
    try {
      const resp = await fetch('/allEntries', {
        headers: {
          'Accept': 'application/json'
        }
      });
      return resp.json();
    } catch (e) {
      console.error(e);
    }
  }
}

class App {
  constructor() {
    this.journalService = new JournalService();
  }

  init() {
    this.listenFormSubmit();
  }

  listenFormSubmit() {
    const form = document.getElementById('form');
    form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formAsJSON = this.formDataAsJSON(form);
    // Inserting a new entry.
    await this.journalService.postEntry(formAsJSON);
    // Getting update entries.
    const allEntries = await this.journalService.getAllEntries();
    console.log(allEntries);
    // todo uncomment after debug
    //form.reset();
  }

  formDataAsJSON(form) {
    const data = new FormData(form);
    const dataJSON = {};
    data.forEach((val, key) => dataJSON[key] = val);
    return dataJSON;
  }
}

new App().init();
