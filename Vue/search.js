import provider from '../Js/DBProvider.js'
import searchItem from './searchItem.js';

export default {
    props: ['searchValue', 'searchType'],
    emits: ['showDetail'],
    data() {
        return {
            data: {
                items: [],
                total_page: 0
            },
            currentPage: 1,
            perPage: 9,
        }
    },
    methods: {
        async getData() {
            try {
                // Fetch the first page to get total_page
                const firstResponse = await provider.methods.fetch(`search/Movies?pattern=${this.searchValue}&per_page=${this.perPage}&page=1&search_type=${this.searchType}`);
                console.log('API Response Page 1:', firstResponse);
                
                let allItems = firstResponse.items;
                const totalPages = firstResponse.total_page;

                // Create an array of page numbers to fetch
                const pages = [];
                for (let page = 2; page <= totalPages; page++) {
                    pages.push(page);
                }

                // Fetch all other pages concurrently
                const promises = pages.map(page => 
                    provider.methods.fetch(`search/Movies?pattern=${this.searchValue}&per_page=${this.perPage}&page=${page}&search_type=${this.searchType}`)
                );

                const responses = await Promise.all(promises);
                responses.forEach(response => {
                    allItems = allItems.concat(response.items);
                });

                // Filter based on searchType
                let filteredItems = [];
                if (this.searchType === 'title') {
                    filteredItems = allItems.filter(movie => 
                        movie.title.toLowerCase().includes(this.searchValue.toLowerCase())
                    );
                } else if (this.searchType === 'actor') {
                    filteredItems = allItems.filter(movie => 
                        movie.actorList.some(actor => 
                            actor.name.toLowerCase().includes(this.searchValue.toLowerCase())
                        )
                    );
                }

                this.data.items = filteredItems;
                this.data.total_page = Math.ceil(filteredItems.length / this.perPage);
                this.currentPage = 1;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        showDetail(film) {
            this.$emit("showDetail", film);
        },
        changePage(isNext) {
            if (isNext && this.currentPage < this.data.total_page) {
                this.currentPage += 1;
                this.getData();
            } else if (!isNext && this.currentPage > 1) {
                this.currentPage -= 1;
                this.getData();
            }
        },
    },
    watch: {
        searchValue(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.currentPage = 1;
                this.getData();
            }
        },
        searchType(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.currentPage = 1;
                this.getData();
            }
        }
    },
    mounted() {
        this.getData();
    },
    components: { searchItem },
    template: `
    <div v-if="data.total_page == 0">
        <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Waiting... ^^</h4>
            <p>I apologize for the inconvenience. The data you are looking for is currently loading or in the process of being updated. We understand the importance of this information to you and are working diligently to resolve this issue. We appreciate your patience and understanding during this time.</p>
            <hr>
            <p class="mb-0">Best Regards, TRAN VAN PHUONG.</p>
        </div>
    </div>
    <div class="row">
        <div v-for="item in data.items.slice((currentPage-1)*perPage, currentPage*perPage)" :key="item.id" class="col-sm-4 p-5">
            <search-item @showDetail="showDetail" :item="item"></search-item>
        </div>
    </div>
    <div v-if="data.total_page > 1" class="row">
        <ul class="pagination d-flex justify-content-center">
            <li class="page-item">
                <a class="page-link" @click="changePage(false)" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item w-25 text-center text-light">{{currentPage}}/{{data.total_page}}</li>
            <li class="page-item">
                <a class="page-link" @click="changePage(true)" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </div>
    `
}