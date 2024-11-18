// Vue/app.js
import pageHeader from './header.js'
import pageHome from './home.js'
import navPage from './nav.js'
import search from './search.js'
import pageFooter from './footer.js'
import filmDetail from './filmDetail.js'
import actorDetail from './actorDetail.js'

export default {
    data() {
        return {
            currentContent: "page-home",
            searchValue: "",
            searchType: "title",
            darkMode: false,
            targetFilm: null,
            selectedActor: null // Added to store selected actor
        }
    },
    computed: {
        getProp() {
            if (this.currentContent === "page-home") {
                return {
                    darkMode: this.darkMode
                }
            }

            if (this.currentContent === "search") {
                return {
                    searchValue: this.searchValue,
                    searchType: this.searchType,
                }
            }
            if (this.currentContent === "film-detail") {
                return {
                    targetFilm: this.targetFilm,
                    darkMode: this.darkMode
                }
            }
            if (this.currentContent === "actor-detail") {
                return {
                    actor: this.selectedActor
                }
            }
        },
        getEvent() {
            if (this.currentContent === "page-home") {
                return {
                    showDetail: this.showDetail
                }
            }

            if (this.currentContent === "search") {
                return {
                    showDetail: this.showDetail
                }
            }
            if (this.currentContent === "film-detail") {
                return {
                    viewActor: this.viewActor
                }
            }
            if (this.currentContent === "actor-detail") {
                return {
                    back: this.viewFilm
                }
            }
        },
    },
    methods: {
        /**
         * Thay đổi chế độ tối.
         */
        handleCheck() {
            this.darkMode = !this.darkMode;
        },
        /**
         * Cập nhật loại tìm kiếm.
         * @param {string} value - Giá trị loại tìm kiếm mới.
         */
        updateSearchType(value) {
            this.searchType = value;
        },
        /**
         * Thực hiện tìm kiếm và chuyển đổi nội dung hiện tại sang `search`.
         */
        search() {
            const searchInput = document.querySelector('input[type="search"]');
            this.searchValue = searchInput ? searchInput.value : '';
            this.currentContent = 'search';
        },
        /**
         * Chuyển đổi nội dung hiện tại sang `film-detail` với `targetFilm` cụ thể.
         * @param {number|string} filmId - ID của phim được chọn.
         */
        showDetail(filmId) {
            this.targetFilm = filmId;
            this.currentContent = 'film-detail';
        },
        /**
         * Chuyển đổi nội dung hiện tại sang `actor-detail` với `selectedActor` cụ thể.
         * @param {Object} actor - Đối tượng diễn viên được chọn.
         */
        viewActor(actor) {
            this.selectedActor = actor;
            this.currentContent = 'actor-detail';
        },
        /**
         * Quay lại trang phim chi tiết và xóa `selectedActor`.
         */
        viewFilm() {
            this.currentContent = 'film-detail';
            this.selectedActor = null;
        },
        /**
         * Quay lại trang chủ và xóa `targetFilm`.
         */
        returnHome() {
            this.currentContent = 'page-home';
            this.targetFilm = null;
        }
    },
    components: {
        pageHeader,
        pageHome,
        navPage,
        search,
        pageFooter,
        filmDetail,
        actorDetail 
    },
    template:
        `
    <div class="container-fluid" :class="{'bg-dark': darkMode, 'bgColor': !darkMode}">
        <page-header @handleCheck="handleCheck" :darkMode="darkMode" />
        <nav-page 
            :darkMode="darkMode" 
            @returnHome="returnHome" 
            @updateSearchType="updateSearchType" 
            @search="search" 
            :searchType="searchType" 
        ></nav-page>
        <component 
            :is="currentContent" 
            v-bind="getProp" 
            v-on="getEvent" 
        />
        <page-footer :darkMode="darkMode" />
    </div>
    `
}