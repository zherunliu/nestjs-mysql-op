<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

let map: any = null;

onMounted(() => {
  AMapLoader.load({
    key: import.meta.env.VITE_JS_API_KEY,
    version: "1.4.15",
    plugins: [],
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 11,
        center: [116.397428, 39.90923],
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100vw;
  height: 800px;
}
</style>
