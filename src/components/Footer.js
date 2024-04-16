class Footer extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
            <div>
                <span>PenekJD</span>
                <div>Powered by <a href="https://alpinejs.dev/" target="_blank">AlpineJS</a> + <a href="/pages/tvjs.html">tv.js</a></div>
            </div>
            
        `;
    }
}
$tv.setComponent(Footer);