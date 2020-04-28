<template>
    <v-list>
      <v-row no-gutters class="d-flex justify-start" v-for="msg in history" v-bind:class="{ 'justify-end' : msg.user == user }" v-bind:key="msg.uuid">
        <Message
          :color="getBackground(msg)"
          :message="msg"
        />
      </v-row>
    </v-list>
</template>

<script>
import Message from "./Message";

export default {
  components: {
    Message
  },
  name: "chat-box",
  props: {
    history: Array,
    user: String
  },
  methods: {
    getBackground(message) {
      if(message.type == 'error') return 'warning'
      return message.user == this.user ? 'blue' : 'white'
    }
  },
  data: () => ({})
};
</script>

<style lang="scss">
  

</style>
