<template>
    <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
         What's your Username?
        </v-card-title>
        <v-card-text>
            <v-text-field
                autofocus
                name="username"
                label="Username"
                v-model="username"
                id="username"
                @keyup.enter="$emit('setUsername', username)"
                :error-messages="errorMessage"
            ></v-text-field>
            
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="error"
            text
            @click="$emit('setUsername')"
          >
            Get Random
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :disabled="!username.length"
            @click="$emit('setUsername', username)"
          >
            Start
          </v-btn>
        </v-card-actions>
      </v-card>
</template>

<script>
export default {
    name: 'login-panel',
    props: {
        errorMessage: String
    },
    data() {
        return {
            username: ''
        }
    }
}
</script>

<style>

</style>