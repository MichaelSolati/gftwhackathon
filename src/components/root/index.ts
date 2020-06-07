import {LitElement, customElement, html, TemplateResult} from 'lit-element';

@customElement('app-root')
export class AppRoot extends LitElement {
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`<google-maps zoom="2"></google-maps>`;
  }
}
