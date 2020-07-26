class App {

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
    await this.postEntry(formAsJSON);
    // todo uncomment after debug
    //form.reset();
  }

  formDataAsJSON(form) {
    const data = new FormData(form);
    const dataJSON = {};
    data.forEach((val, key) => dataJSON[key] = val);
    return dataJSON;
  }

  async postEntry(jsonData) {
    try {
      const resp = await fetch('/newEntry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
      });
      if (resp.ok) {
        return await resp.json();
      } else {
        throw new Error(resp.statusText);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

new App().init();
