<template>
  <div class="pad">
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
    <el-dialog
        title="Edit"
        :visible.sync="editKey"
        width="30%">

        <el-input placeholder="Key" v-model="currentKey.key"></el-input>
        <div class="block">
          <span class="demonstration">Color</span>
          <el-color-picker v-model="currentKey.color"></el-color-picker>
        </div>
        <el-select v-model="currentKey.sound" placeholder="Sound">
          <el-option
            v-for="item in sounds"
            :key="item.sound"
            :label="item.name"
            :value="item.sound">
          </el-option>
        </el-select>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editKey = false">Cancel</el-button>
          <el-button type="primary" @click="confirmEdit">Confirm</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script src = "./Pad.js">
</script>

<style scoped lang="css" src = './Pad.css'>
</style>

