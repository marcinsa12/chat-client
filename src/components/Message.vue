<template>
    <v-card class="ma-2" elevation="1" :color="color" min-width="225px" max-width="75%">
        <v-toolbar color="transparent" flat>
            <div class="overline ma-2">
                {{new Date(msgDate).toLocaleTimeString()}}
            </div>
            <v-spacer></v-spacer>
            <div class="overline ma-2">
                by <span class="red--text">{{msgAuthor}}</span>
            </div>
        </v-toolbar>
        <v-card-text>
            {{msgText}}
        </v-card-text>
    </v-card>
</template>

<script>
export default {
  name: "message",
  props: {
    author: String,
    text: String,
    date: Date,
    type: String,
    message: Object,
    color: String
  },
  computed: {
      msgAuthor() {
          return (this.message.user || this.author || '').toUpperCase()
      },
      msgText() {
          return this.message.message || this.message || ''
      },
      msgDate() {
          return this.message.date || this.date || ''
      },
      msgType() {
          return this.message.type || this.type || ''
      }
  }
};
</script>

<style>
</style>