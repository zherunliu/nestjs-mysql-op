<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";

let map: any = null;
const getPos = (key: string) => {
  return axios.get("http://localhost:3000/geoAllPos?key=" + key);
};

onMounted(() => {
  AMapLoader.load({
    key: import.meta.env.VITE_JS_API_KEY,
    version: "1.4.15",
    plugins: [],
  })
    .then(async (AMap) => {
      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 11,
        center: [116.397428, 39.90923],
      });

      const res = await getPos("BJ");
      res.data.forEach((element) => {
        const marker = new AMap.Marker({
          position: [element.posInfo.longitude, element.posInfo.latitude],
          anchor: "bottom-center",
        });
        map.add(marker);
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
  width: 100%;
  height: 800px;
}
</style>
