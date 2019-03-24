<template>
  <div class="pad">
    {{keyboard}}
    <div v-for="(row, i) in rows" :key="i" class="row">
      <div
        v-for="(key, j) in row"
        class="key"
        :class="{ selected: key.selected }"
        :key="j"
        :style="{ background: key.color}"
        @click="select(key)"
      >
        <div>
          <div class="key--sound">{{key.name}}</div>
          <div class="key--code">{{key.key}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src = "./Pad.js">
</script>

<style scoped lang="css" src = './Pad.css'>
</style>

