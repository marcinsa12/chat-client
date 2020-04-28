<template>
  <v-footer class="chat-panel" min-height="125px" app>
     <v-text-field
         label="Message"
         name="message"
         v-model="message"
         textarea
         :color="message.length ? 'success':'error'"
         @keyup.enter="sendMessage"
         append-outer-icon="mdi-send"
         @click:append-outer="sendMessage"
     ></v-text-field>
  </v-footer>
</template>

<script>
export default {
    name: "chat-panel",
    data() {
        return {
            message: ''
        }
    },
    methods: {
        sendMessage() {
            if(!this.message.length) return;
            this.$emit('sendMessage', this.message)
            this.message = ''
        }
    }

}
</script>

<style>
    
</style>