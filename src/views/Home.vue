<template>
  <div class="">
    <div class="columns is-marginless">
      <div class="column is-4 hero is-fullheight">
        <div class="hero-head mb-2">
          <b-field label="Recherche">
            <b-input
              id="input-searchBox"
              placeholder="recherche">
            </b-input>
          </b-field>
        </div>
        <div class="hero-body p-0 is-relative">
          <div class="is-overflow">
            <div class="media"
              v-for="(marker, index) in markers"
              :key="index">
              <div class="media-left">
                <figure>
                  <img :src="marker.url || 'https://www.kenyons.com/wp-content/uploads/2017/04/default-image-620x600.jpg'" class="img-cover">
                </figure>
              </div>
              <div class="media-content">
                <div class="content">
                  <div class="level mb-0">
                    <div class="level-left">
                      <div class="level-item">
                        <img class="image is-16x16" :src="marker.icon">
                      </div>
                      <div class="level-item">
                        <strong>{{ marker.name }}</strong>
                      </div>
                    </div>
                  </div>
                  <p> {{ marker.adresse }} </p>
                  <b-taglist>
                    <b-tag
                      v-for="(type, el) in marker.types"
                      :key="el"
                      rounded
                      type="is-info">
                      {{type}}
                    </b-tag>
                  </b-taglist>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column p-0">
        <Gmap-Map
          style="width: 100%; height: 100%;"
          :center="constantes.CENTER_DEFAULT"
          :zoom="constantes.ZOOM_DEFAULT"
          ref="carto">
          <Gmap-Marker
            v-for="(marker, index) in markers"
            :key="index"
            :animation="marker.animation"
            :position="marker.position">
          </Gmap-Marker>
          <Gmap-Marker
            :position="constantes.CENTER_DEFAULT"
            :icon="constantes.MARKER_POINT_NOIR">
          </Gmap-Marker>
        </Gmap-Map>
      </div>
    </div>
  </div>
</template>

<script>
import { ZOOM_DEFAULT, CENTER_DEFAULT, MARKER_POINT_NOIR  } from '@/configuration/configurationCarte';

export default {
  data() {
    return {
      map: null,
      markers: [],
      constantes: {
        CENTER_DEFAULT,
        ZOOM_DEFAULT,
        MARKER_POINT_NOIR
      }
    }
  },
  methods: {
    init() {
      const input = document.getElementById('input-searchBox');
      const searchBox = new google.maps.places.SearchBox(input);
      this.map.addListener('bounds_changed', () => {
        searchBox.setBounds(this.map.getBounds());
      });

      searchBox.addListener('places_changed', () => {
        this.markers = []
        const places = searchBox.getPlaces();
        places.forEach(p => {
          this.markers.push({
            position: {
              lat: p.geometry.location.lat(),
              lng: p.geometry.location.lng(),
            },
            animation: google.maps.Animation.DROP,
            url: p.photos ? p.photos[0].getUrl() : '',
            name: p.name,
            adresse: p.formatted_address,
            icon: p.icon,
            types: p.types
          })
        });
      });
    },
    async levelZoom() {
      await this.$refs.carto.$mapPromise;
      await this.fitBounds();
    },
    async fitBounds() {
      const bounds = new google.maps.LatLngBounds();
      if (this.markers.length) {
        this.markers.forEach(el => {
          bounds.extend(el.position);
        })
      }
      this.$refs.carto.fitBounds(bounds);
    },
  },
  async mounted() {
    this.map = await this.$refs.carto.$mapPromise;
    this.init()
  }
}
</script>

<style>
.is-overflow {
  overflow: hidden;
  height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
  -ms-overflow-style: none;
}
.is-overflow::-webkit-scrollbar {
  display: none;
}
.img-cover {
  object-fit: cover;
  width: 64px;
  height: 64px;
}
</style>
