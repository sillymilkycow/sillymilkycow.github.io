$tv.setComponent(
    class Assessment extends HTMLElement {
        constructor() {
            super();
                
            //const content = this.innerHTML;

            const component = function(){
                return {
                    checkObj: null,
                    currentInput: '',
                    type: 0,
                    groupCount: null,
                    firstIdx: 0,
                    lastIdx: 0,
                    assessmentTypes: ['Order', 'Random'],
                    motivations: {
                        4: ['🥳 Fantastic', '👱 Your mom could proud of you', '🤟 Damn you\'re good', '💪 Thats ma man', '💣 BOOM-bastic!', '🌟 You\'re the best!', '🤩 Superman - it\'s You!'],
                        3: ['Nice work', 'Well done', 'Keep it up!', 'Good!', 'Nicely done'],
                        2: ['Not bad', 'Ok', 'You can better', 'Yeah...', 'Ok for A1'],
                        1: ['Try harder', 'You should learn more', 'Did you even learn smth?!', 'Wooops...', 'Thats crappy', 'My grandma can do better', 'It\'s all you got?'],
                        0: ['😾 Are you serious?', '👹 Booo for you...', '😿 No way...', '💩 Holly shmolly...', '🙀 Ouh my...', '🤕 Shame on you...']
                    },
                    showMotivation: '',
                    isByDate: false,
                    selectedDate: null,
                    datesArr: [],
                    updatesCount: 0,
                    selectedIdx: 0,
                    arrayForRender: [],
                    unprepared: true,
                    evaluated: true,
                    currentEvaluation: null,
                    wordsEvaluation: [],
                    isTillRemember: false,
                    data: {},

                    init(){
                        this.addHookEvents();
                    },

                    checkInput(){
                        if (this.unprepared) { return; }
                        if (!this.currentInput) {
                            this.getObjectForAssessment();
                            this.evaluated = false;
                            return;
                        }
                        if (this.evaluated) {
                            this.currentInput = '';
                            if (this.isTillRemember) {
                                if (this.currentEvaluation===4) {
                                    this.getObjectForAssessment();
                                }
                            } else {
                                this.getObjectForAssessment();
                            }
                            this.evaluated = false;
                        } else {
                            this.evaluateInput();
                            this.evaluated = true;
                            this.callUpdate();
                        }
                    },

                    handleGroup(){
                        if (this.groupCount) {

                        } else {}
                    },

                    getObjectForAssessment(){
                        if (this.assessmentTypes[this.type]==='Random') {
                            this.selectedIdx = Math.floor( Math.random() * this.arrayForRender.length );
                        } else {
                            this.selectedIdx++;
                            if (this.selectedIdx>=this.arrayForRender.length) {
                                this.selectedIdx = 0;
                            }
                        }
                        this.checkObj = this.arrayForRender[this.selectedIdx];
                    },

                    evaluateInput(){
                        if ( this.checkObj && this.checkObj.translate ) {
                            let self = this;
                                self.wordsEvaluation = [];
                                self.currentEvaluation = 0;
                            let originalLang = this.checkObj.lang.trim().toLowerCase().split(' ');
                            let checkInput = this.currentInput.replace(/\s+/g, ' ').trim().toLowerCase().split(' ');
                            originalLang.forEach( (word, idx) => {
                                let wordObj = { word: word, score: 0 };
                                if (word===checkInput[idx]) {
                                    wordObj.score++;
                                }
                                if ( checkInput.indexOf(word) >= 0 ) {
                                    wordObj.score++;
                                }
                                self.currentEvaluation += wordObj.score;
                                self.wordsEvaluation.push(wordObj);
                            } );
                            self.currentEvaluation = Math.round( 4*self.currentEvaluation/(originalLang.length*2) );

                            // *********** start: Save evaluation results of fraze ***********
                            self.checkObj['check_numbers'] = self.checkObj['check_numbers'] ? self.checkObj['check_numbers']+=1 : 1;
                            self.checkObj['common_score'] = self.checkObj['common_score'] ? self.checkObj['common_score'] += self.currentEvaluation : self.currentEvaluation;
                            if ( self.checkObj['average_score'] ) {
                                self.checkObj['average_score'] = Math.round( self.checkObj['common_score'] / self.checkObj['check_numbers'] );
                            } else {
                                self.checkObj['average_score'] = self.currentEvaluation;
                            }
                            let curDate = new Date();
                                curDate = curDate.getFullYear()+'-'+curDate.getMonth()+'-'+curDate.getDate();
                            self.checkObj['last_check'] = curDate;
                            // *********** end: Save evaluation results of fraze ***********

                            self.setMotivationStr();
                        }
                    },

                    setMotivationStr(){
                        let getRandom = Math.floor(Math.random() * this.motivations[this.currentEvaluation].length);
                        this.showMotivation = this.motivations[this.currentEvaluation][getRandom];
                    },

                    changePreparation(){
                        this.checkObj = null;
                        this.selectedIdx = 0;
                        this.unprepared = true;
                        this.prepareArrayForRender();
                    },

                    prepareArrayForRender(){
                        let self = this;
                        let newArr = [];
                        newArr = self.data.words_pares ? [...self.data.words_pares] : [];
                        if (this.isByDate) {
                            newArr = newArr.filter( el => el.date === self.selectedDate );
                        }
                        this.arrayForRender = newArr;
                        this.unprepared = false;
                    },

                    prepareDatesArr(){
                        if (this.updatesCount < 2) {
                            let newArr = [...this.data.words_pares];
                            newArr = newArr.sort( (a, b) => { 
                                return new Date(b.date)-new Date(a.date); 
                            });
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
                                self.prepareArrayForRender();
                            }
                        });
                        window.addEventListener('check_comp', function(){
                            console.log(self.data);
                        })
                    }

                }
            }

            this.innerHTML = /*html*/`
                <div x-data="${component}">

                    <div class="title">
                        <h2>Assessment</h2>
                        <div style="display: flex; flex-direction:row; justify-content:end; gap:5px; align-items:center;">
                            <div class="display: flex; flex-direction:row; gap:5px; align-items:center;">
                                <span x-text="selectedIdx+1"></span> /
                                <span x-text="arrayForRender && arrayForRender.length"></span>
                                <select x-model="type" style="margin-left:10px;">
                                    <template x-for="(type, idx) in assessmentTypes">
                                        <option :value="idx" x-text="type"></option>
                                    </template>
                                </select>
                                <!--
                                <select x-model="groupCount" @click="handleGroup()" style="margin-left:10px;">
                                    <option value="">all</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="10">20</option>
                                </select>
                                <template x-if="groupCount">
                                    <button>Next</button>
                                </template>
                                -->
                            </div>
                            <template x-if="datesArr.length">
                                <div style="display:flex; flex-direction:row; align-items:center; gap:5px;">
                                    <span style="white-space: nowrap; font-size:12px; margin-left:20px;">Group by date:</span>
                                    <input style="max-width:16px; height:16px; margin:0;" 
                                        type="checkbox"
                                        x-model="isByDate"
                                        @change="changePreparation()"
                                    >
                                </div>
                            </template>
                            <div style="display:flex; flex-direction:row; align-items:center; gap:5px;">
                                <span style="white-space: nowrap; font-size:12px; margin-left:20px;">Till remember:</span>
                                <input style="max-width:16px; height:16px; margin:0;" 
                                    type="checkbox"
                                    x-model="isTillRemember"
                                >
                            </div>
                        </div>
                    </div>

                    <template x-if="isByDate || isTillRemember">
                        <div style="display:flex; justify-content:end; gap:8px; margin:-5px 0px 5px;">
                            <template x-if="isTillRemember">
                                <span style="font-size:22px;">🐵</span>
                            </template>
                            <template x-if="isByDate">
                                <div style="display:flex; gap:4px; padding:4px; background-color:rgb(64, 126, 189); border-radius:6px;">
                                    <span>🗓</span>
                                    <select x-model="selectedDate" @change="changePreparation()">
                                        <template x-for="el in datesArr">
                                            <option x-bind:value="el.date" x-text="el.date"></option>
                                        </template>
                                    </select>
                                </div>
                            </template>
                        </div>
                    </template>

                    <div class="assessment-block">
                        <template x-if="checkObj">
                            <div style="padding:5px; font-weight:bold; font-size: 18px; background-color: #ff0; position: relative; z-index:5;"
                                 x-text="checkObj.translate"
                            ></div>
                        </template>
                        <input style="font-size:18px;"
                               x-model="currentInput" 
                               @keyup.enter="checkInput()"
                               x-bind:placeholder=" !checkObj ? 'Press Enter to start' : 'Enter translation' "
                        />
                    </div>

                    <template x-if="evaluated && wordsEvaluation.length">
                        <div class="evaluation_block">
                            <div class="check_words_row">
                                <template x-for="wordObj in wordsEvaluation">
                                    <span x-bind:class="'check_word text-outline score_' + wordObj.score " 
                                        x-text="wordObj.word"
                                    ></span>
                                </template>
                            </div>
                            <template x-if="currentEvaluation || currentEvaluation===0">
                                <div x-bind:class="'evaluation text-outline eval_score_'+currentEvaluation">
                                    <span class="digit" x-text="currentEvaluation+1"></span>
                                    <span style="font-size: 16px; color:#fff;" x-text="showMotivation"></span>
                                </div>
                            </template>
                        </div>
                    </template>

                </div>
                <link href="/src/styles/assessment.css" rel="stylesheet" type="text/css">
            `;
        }
    }
);