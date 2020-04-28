<template>
  <v-app id="inspire">

    <v-navigation-drawer v-model="leftDrawer" :permanent="!isMobile" app clipped>
      <ActiveUsersPanel
        :users="connectedClients"
        :selectedUser="selectedUser"
        :activeUser="user"
        @selectUser="selectUser"
      />
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark clipped-left >
      <v-btn icon color="white" v-if="isMobile" @click="leftDrawer=!leftDrawer"> 
        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>

      <v-toolbar-title>Super Simple Chat</v-toolbar-title>
      
      <v-spacer></v-spacer>

      <v-menu offset-y v-if="isMobile">
        <template v-slot:activator="{ on }">  
          <v-btn icon v-on="on" :color="chatConnected ? 'success' : 'error'">
            <v-icon>mdi-checkbox-blank-circle</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            {{chatConnected ? `Connected as : ${user}` : 'Disconnected'}}
          </v-card-text>
        </v-card>
      </v-menu>
      <v-toolbar-items v-else class="d-flex align-center">
        <v-icon :color="chatConnected ? 'success' : 'error'" class="mr-2">mdi-checkbox-blank-circle</v-icon>
        <span>{{chatConnected ? `Connected as : ${user}` : 'Disconnected'}}</span>
      </v-toolbar-items>
    </v-app-bar>

    <v-snackbar v-model="reconnecting" bottom :timeout="0" color="error" multi-line>
      <v-icon color="white">mdi-alert-circle</v-icon>Trying to reconect you to the server
      <v-progress-circular :size="25" color="white" indeterminate></v-progress-circular>
    </v-snackbar>
    
    <v-content >
      <ChatBox :history="messagesToDisplay" :user="user" />
    </v-content>
    
    <ChatPanel @sendMessage="sendMessage" />
    
    <v-dialog
      v-model="showLoginPanel"
      persistent
      overlay-opacity="1"
      width="500"
      transition="dialog-transition"
    >
      <LoginPanel @setUsername="setUsername" :errorMessage="errorMessage" />
    </v-dialog>
  
  </v-app>
</template>

<script>
import ChatBox from "./components/ChatBox";
import ChatPanel from "./components/ChatPanel";
import LoginPanel from "./components/LoginPanel";
import ActiveUsersPanel from "./components/ActiveUsersPanel";

export default {
  name: "App",

  components: {
    ChatBox,
    ChatPanel,
    LoginPanel,
    ActiveUsersPanel
  },

  data: () => ({
    leftDrawer: true,
    showLoginPanel: true,
    socketAddress: "ws://127.0.0.1:2990",
    chatConnected: false,
    globalMessages: [],
    reconnecting: false,
    errorMessage: "",
    directMessages: {},
  }),
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xs
    },
    messagesToDisplay() {
      return this.$store.getters.messagesToDisplay
    },
    chatSocket() {
      return this.$store.state.chatSocket
    },
    connectedClients() {
      return this.$store.state.connectedClients
    },
    user(){
      return this.$store.state.username
    },
    selectedUser() {
      return this.$store.state.selectedUser
    }
  },
  methods: {
    sendMessage(msg) {
      this.$store.dispatch('sendMessage', {
            type: "text",
            message: msg,
            user: this.user,
            directTo: this.selectedUser || null
          })
    },
    getConnection() {
      let chatSocket = new WebSocket(
        `${this.socketAddress}?user=${this.user}`
      );
      chatSocket.addEventListener("open", this.onConnect);
      chatSocket.addEventListener("message", this.onNewMessage);
      chatSocket.addEventListener("close", this.onDisconnect);
      chatSocket.addEventListener("error", () => {
        chatSocket.close();
      });
      this.$store.commit('setChatSocket', chatSocket)
    },
    onConnect() {
      this.chatConnected = true;
      this.reconnecting = false;
    },
    onDisconnect() {
      this.chatConnected = false;
      this.reconnecting = true;
      setTimeout(() => {
        console.log("Trying to reconect you to the server");
        this.getConnection();
      }, 5000);
    },
    onNewMessage(e) {
      const data = JSON.parse(e.data);
      if (data.type == "retrieve") {
        this.$store.dispatch('refreshSocket', data)
      } else if (data.type == "error") {
        if (data.message == "user-already-exist") {
          this.chatSocket.removeEventListener("close", this.onDisconnect);
          this.chatSocket.close();
          this.reconnecting = false;
          this.showLoginPanel = true;
          this.errorMessage = "User already exist";
        }
      } else {
        if (data.directTo) {
          this.$store.dispatch('addMessageToDirectHistory', data)
        } else {
          this.$store.commit('addMessageToHistory', data);
        }
      }
      this.$vuetify.goTo(99999);
    },
    setUsername(username) {
      this.$store.commit('setUsername', username || this.getRandomUserName());
      this.showLoginPanel = false;
      this.getConnection();
    },
    selectUser(user){
      if(!this.directMessages[user]) this.directMessages[user] = []; 
      this.selectedUser = user;
    },
    getRandomUserName() {
      return (
        Math.random()
          .toString(36)
          .substring(2, 7) +
        Math.random()
          .toString(36)
          .substring(2, 7)
      );
    }
  }
};
</script>