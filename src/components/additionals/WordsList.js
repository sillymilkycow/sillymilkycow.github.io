$tv.setComponent(
    class WordsList extends HTMLElement {
        constructor() {
            super();
    
            // const content = this.innerHTML ? this.innerHTML : '';

            const component = function() {
                return {
                    selectedDate: null,
                    datesArr: [],
                    updatesCount: 0,
                    hoverID: null,
                    data: {},

                    init(){
                        this.addHookEvents();
                    },

                    prepareDatesArr(){
                        if (this.updatesCount < 2) {
                            let newArr = [...this.data.words_pares];
                            let COUNTCHECK = 0;
                            newArr = newArr.sort( (a, b) => {
                                b['id'] = COUNTCHECK;
                                COUNTCHECK++;
                                return new Date(b.date)-new Date(a.date); 
                            });
                            if (newArr.length && newArr[newArr.length-1]) {
                                newArr[newArr.length-1]['id'] = COUNTCHECK;
                            }
                            let prevDate = '';
                            newArr = newArr.filter( el => {
                                if (el.date!==prevDate) { 
                                    prevDate = el.date;
                                    return true; 
                                }
                                prevDate = el.date;
                            } );
                            this.datesArr = newArr;
                            this.selectedDate = this.datesArr[0].date;
                            this.updatesCount++;
                        }
                    },

                    callUpdate(){
                        let self = this;
                        window.dispatchEvent( new CustomEvent( 'data-save-storage', { detail: { data: self.data } } ) );
                    },

                    addHookEvents(){
                        let self = this;
                        window.addEventListener('app-updated', function(e) {
                            if (e.detail && e.detail.data && e.detail.data.words_pares) {
                                self.data = { 
                                    ...self.data, 
                                    words_pares: e.detail.data.words_pares 
                                };
                                self.prepareDatesArr();
                            }
                        });
                    }
                }
            }
    
            this.innerHTML = /*html*/`
                <div x-data="${component}" style="width:100%;">
                    <div style="display:flex; margin-bottom:10px; flex-direction:row; justify-content: space-between; width:100%; align-items:center; background-image: linear-gradient(to right, transparent, rgb(64, 126, 189));">
                        <h2 style="margin:0; padding:10px 0;">🗃 Fraze base</h2>
                        <span style="font-weight:bold; font-size:20px; padding-right:20px; color:#fff;" 
                              x-text="'🪙 '+(data.words_pares ? data.words_pares.length : 0)"
                        ></span>
                    </div>
                    <template x-if="datesArr && datesArr.length">
                        <div style="display:flex; justify-content:end; align-items:center; margin:-5px 0px 5px;">
                            <span style="margin-right:5px; font-size:12px;">Render date:</span>
                            <select x-model="selectedDate">
                                <template x-for="el in datesArr">
                                    <option x-bind:value="el.date" x-text="el.date"></option>
                                </template>
                            </select>
                        </div>
                    </template>
                    <template x-if="data.words_pares && data.words_pares.length">
                        <div class="words-column">
                            <template x-for="el in data.words_pares.filter( el => el.date === selectedDate )">
                                <div x-bind:class="'string-row evaluation_'+( el.average_score || el.average_score===0 ? el.average_score : 'none')"
                                     @click="hoverID = el.id" @mouseleave="hoverID = null"
                                >   
                                    <template x-if="el.id === hoverID">
                                        <div class="translate">
                                            <span x-text="el.translate"></span>
                                            <input type="text" x-model="el.translate" @keyup.enter="callUpdate()"/>
                                        </div>
                                    </template>
                                    <div class="lang" x-text="el.lang"></div>
                                </div>
                            </template>
                        </div>
                    </template>
                    <link href="/src/styles/wordslist.css" rel="stylesheet" type="text/css">
                </div>
            `;
        }
    }
);