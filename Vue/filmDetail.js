// filmDetail.js
import provider from '../Js/DBProvider.js'

export default {
    props: {
        targetFilm: {
            type: [String, Number],
            default: "default"
        },
        darkMode: Boolean
    },
    data() {
        return {
            film: {},
            hasData: false,
            errorMessage: '',
            reviews: [],
            reviewsError: '',
            reviewsLoading: false
        }
    },
    methods: {
        async getData() {
            try {
                const query = `detail/Movies/${this.targetFilm}`;
                console.log('Fetching movie details with query:', query);
                const response = await provider.methods.fetch(query);
                if (response && Array.isArray(response.items) && response.items.length > 0) {
                    this.film = response.items[0];
                    this.hasData = true;
                    this.fetchReviews();
                } else {
                    throw new Error('no data');
                }
            } catch (error) {
                console.error(error);
                this.hasData = false;
                this.errorMessage = 'Không tìm thấy dữ liệu phim.';
            }
        },
        async fetchReviews() {
            this.reviewsLoading = true;
            try {
                const query = `get/Reviews?movieId=${this.film.id}`;
                console.log('Fetching reviews with query:', query);
                const response = await provider.methods.fetch(query);
                console.log('Reviews response:', response);
                
                if (response && Array.isArray(response.items)) {
                    this.reviews = response.items[0].items; // Access the nested items array
                    console.log(`Found ${this.reviews.length} reviews for movie ID ${this.film.id}`);
                    console.log('All reviews:', this.reviews);
                    
                    if (this.reviews.length > 0) {
                        console.log('First review object:', this.reviews[0]);
                    }
                } else {
                    throw new Error('no reviews');
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                this.reviewsError = 'Không tải được đánh giá.';
            } finally {
                this.reviewsLoading = false;
            }
        },
        viewActorDetails(actor) {
            console.log('Emitting view-actor event for:', actor);
            this.$emit('view-actor', actor);
        },
        handleImageError(event) {
            event.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
        },
        renderStars(rate) {
            const stars = [];
            const rating = parseInt(rate);
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    stars.push('<i class="fas fa-star text-warning"></i>');
                } else {
                    stars.push('<i class="far fa-star text-warning"></i>');
                }
            }
            return stars.join(' ');
        }
    },
    mounted() {
        this.getData();
    },
    template:
        `
    <div v-if="hasData" class="container py-4">
        <div class="row mb-4">
            <div class="col-md-6">
                <img :src="film.image" class="img-fluid rounded" :alt="film.title" @error="handleImageError">
            </div>
            <div class="col-md-6">
                <h1 :class="{'text-light': darkMode}" class="mb-3">{{ film.title }} ({{ film.year }})</h1>
                <p><strong>Đạo diễn: </strong>
                    <span v-for="(director, index) in film.directorList" :key="director.id">
                        {{ director.name }}<span v-if="index < film.directorList.length - 1">, </span>
                    </span>
                </p>
                <p><strong>Thể loại: </strong>
                    <span v-for="(genre, index) in film.genreList" :key="genre.key">
                        {{ genre.value }}<span v-if="index < film.genreList.length - 1">, </span>
                    </span>
                </p>
                <p><strong>Tóm tắt: </strong> {{ film.plotFull }}</p>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-12">
                <h3 :class="{'text-light': darkMode}" class="mb-3">Diễn viên</h3>
                <div class="row">
                    <div class="col-md-3 mb-3" v-for="actor in film.actorList" :key="actor.id">
                        <div class="card h-100" @click="viewActorDetails(actor)">
                            <img :src="actor.image" class="card-img-top" :alt="actor.name" @error="handleImageError">
                            <div class="card-body">
                                <h5 class="card-title">{{ actor.name }}</h5>
                                <p class="card-text">{{ actor.asCharacter }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reviews Section -->
        <div class="row mb-4">
            <div class="col-12">
                <h3 :class="{'text-light': darkMode}" class="mb-3">Đánh giá</h3>
                <div v-if="reviewsLoading" class="d-flex justify-content-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-else-if="reviewsError" class="alert alert-danger" role="alert">
                    {{ reviewsError }}
                </div>
                <div v-else>
                    <div v-if="reviews.length > 0" class="list-group">
                        <div v-for="review in reviews" :key="review.id || review.username + review.date" class="list-group-item">
                            <h5>{{ review.title }}</h5>
                            <p><strong>{{ review.username }}</strong> - {{ review.date }}</p>
                            <p v-if="review.rate"><strong>Rate:</strong> {{ review.rate }}/10</p>
                            <p>{{ review.content }}</p>
                        </div>
                    </div>
                    <div v-else class="alert alert-info" role="alert">
                        Không có đánh giá nào.
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="container py-4">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>
        <div v-else class="d-flex justify-content-center align-items-center" style="height: 300px;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    `
}