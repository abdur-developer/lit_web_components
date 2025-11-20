import { LitElement, html } from 'https://unpkg.com/lit?module';

class AbdurDeveloper extends LitElement {
  static properties = {
    page: { type: String },    // example: "home"
    cssFile: { type: String }, // example: "style.css"
  };

  constructor() {
    super();
    this.page = this.getAttribute('page');
    this.cssFile = "" + this.getAttribute('page') + ".css";
    this.content = "";
  }

  createRenderRoot() {
    const root = super.createRenderRoot();

    // Dynamic CSS injection
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = this.cssFile;
    root.appendChild(link);

    return root;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadPage();
  }

  updated(changedProps) {
    if (changedProps.has("page") || changedProps.has("cssFile")) {
      // reload CSS + HTML when attributes change
      this.loadPage();
    }
  }

  loadPage() {
    const htmlPath = `./includes/${this.page}.html`;

    fetch(htmlPath)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText || res.status);
        return res.text();
      })
      .then((text) => {
        this.content = text;
        this.requestUpdate();
      })
      .catch((err) => {
        this.content = `<pre style="color:red">Error loading ...:\n${err}</pre>`;
        this.requestUpdate();
      });
  }

  render() {
    return html`
      <div .innerHTML=${this.content}></div>
    `;
  }
}

customElements.define("abdur-developer", AbdurDeveloper);
