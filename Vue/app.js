import pageHeader from './header.js'
import pageHome from './home.js'
import navPage from './nav.js'
import search from './search.js'

export default {
    data() {
        return {
            currentContent: "page-home",
            searchValue: "",
            searchType: "title",
            darkMode: false
        }
    },
    computed:{
        getProp() {
            if(this.currentContent == "page-home") {
                return {
                    darkMode: this.darkMode
                }
            }
        
            if(this.currentContent == "search") {
                return {
                    searchValue: this.searchValue,
                    searchType: this.searchType,
                    
                }
            } 
        
            
            
        },
        getEvent() {
            if(this.currentContent == "page-home") {
                return {
                    showDetail: this.showDetail
                }
            }

            if(this.currentContent == "search") {
                return {
                    showDetail: this.showDetail
                }
            }

        },
        
        
    },
    methods: {
        handleCheck() {
            this.darkMode = !this.darkMode;
        },
        updateSearchType(value){
            this.searchType = value;
        },
        search() {
            this.searchValue = $('input[type="search"]').val();
            this.currentContent = 'search';
        },

        returnHome(){
            this.currentContent = 'page-home';
        }
    },
    components: {
        pageHeader,pageHome,navPage,search
    },
    template: 
    `
    <div class="container-fluid" :class="{'bg-dark': darkMode,'bgColor' : !darkMode}">
            <page-header @handleCheck="handleCheck" :darkMode="darkMode"/>
            <nav-page :darkMode="darkMode" @returnHome="returnHome" @updateSearchType="updateSearchType" @search="search" :searchType="searchType" ></nav-page>
            <component :is="currentContent" v-bind="getProp" v-on="getEvent" />
            <page-footer :darkMode="darkMode"/>
    </div>
    `
}