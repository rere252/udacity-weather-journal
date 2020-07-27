class JournalService {
  postEntry(jsonData) {
    return fetch('/newEntry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    });
  }

  async getAllEntries() {
    return fetch('/allEntries', {
      headers: {
        'Accept': 'application/json'
      }
    }).then(resp => resp.json());
  }
}

class App {
  constructor() {
    this.journalService = new JournalService();
    this.entries = new Map();
  }

  init() {
    this.updateEntries();
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
    this.journalService.postEntry(formAsJSON)
      .then(async resp => {
        if (resp.ok) {
          this.updateEntries();
          form.reset();
        } else {
          throw new Error(await resp.text());
        }
      })
      .catch(e => {
        alert(e.message);
        console.error(e);
      });
  }

  updateEntries() {
    this.journalService.getAllEntries()
      .then(entries => this.insertNewEntriesToDOM(entries));
  }

  insertNewEntriesToDOM(entries) {
    for (const entry of entries) {
      const newEntriesFragment = new DocumentFragment();
      if (!this.entries.has(entry.id)) {
        const entryTemplate = document.createElement('template');
        entryTemplate.innerHTML = `
          <dt>${entry.dateTime}, ${entry.location}: ${entry.weather}</dt>
          <dd class="app__entries-feelings">${entry.feelings}</dd>
        `;
        newEntriesFragment.appendChild(entryTemplate.content);
        this.entries.set(entry.id, entry);
      }
      const entriesEl = document.getElementById('entries');
      entriesEl.insertBefore(newEntriesFragment, entriesEl.firstElementChild);
    }
  }

  formDataAsJSON(form) {
    const data = new FormData(form);
    const dataJSON = {};
    data.forEach((val, key) => dataJSON[key] = val);
    return dataJSON;
  }
}

new App().init();
