<template>
  <v-container class="pa-0">
      <v-toolbar elevation="1">
          <v-toolbar-title>
              Other Active Users
          </v-toolbar-title>
      </v-toolbar>
      <v-list-item-group>
        <v-list-item v-for="user in usersOnline" :key="user" @click="$store.commit('selectUser',user)">
            <v-avatar
                v-if="user == selectedUser"
            >
                <v-icon>mdi-comment-processing</v-icon>
            </v-avatar>
            {{user}}
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item color="warning" v-if="selectedUser" @click="$store.commit('selectUser', '')">
            Show Room chat
        </v-list-item>
      </v-list-item-group>
  </v-container>
</template>

<script>
export default {
    name: 'active-users-panel',
    props: { 
        users: Array,
        activeUser: String,
        selectedUser: String
    },
    computed: {
        usersOnline() {
            return this.users.filter(u => u != this.activeUser)
        }
    }
}
</script>

<style>

</style>