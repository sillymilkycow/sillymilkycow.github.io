$tv.setComponent(
    class SiteMenu extends HTMLElement {
        constructor() {
            super();

            const component = function(){
                return {
                    selectedIdx: null,
                    menuArr: [
                        {title:'📔 Abstract', url:'/index.html'},
                        {title:'📝 Assessment', url:'/pages/page1.html'},
                        {title:'🪧 About', url:'/pages/about.html'},
                    ],
                    init(){
                        let self = this;
                        let strPath = window.location.pathname.split('/');
                            strPath = strPath[strPath.length-1];
                        this.menuArr.forEach( (elem, idx) => {
                            if (elem.url.indexOf(strPath) >= 0) {
                                self.selectedIdx = idx;
                            }
                        });
                    }
                }
            }

            this.innerHTML = /*html*/`
                <nav x-data="${component}">
                    <ul>
                        <template x-for="(item, idx) in menuArr">
                            <li>
                                <a  x-text="item.title" 
                                    x-bind:href="item.url"
                                    :class="{
                                        'selected' : selectedIdx === idx
                                    }"
                                    class="menu-tab"
                                ></a>
                            </li>
                        </template>
                    </ul>
                </nav>
                <site-top-additionals></site-top-additionals>
            `;
        }
    }
);