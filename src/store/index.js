import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    chatSocket: null,
    messagesHistory: [],
    directMessages: {},
    connectedClients: [],
    selectedUser: "",
    username: "",
  },
  mutations: {
    setChatSocket(state, socket) {
      state.chatSocket = socket
    },
    setMessagesHistory(state, msgs) {
      state.messagesHistory = msgs
    },
    updateConnectedClients(state, clients) {
      state.connectedClients = clients
    },
    addMessageToHistory(state, msg) {
      state.messagesHistory.push(msg)
    },
    setUsername(state, username) {
      state.username = username
    },
    selectUser(state, user) {
      state.selectedUser = user
    },
    setMessagesForUser(state, data) {
      state.directMessages = 
      {
          [data.user] : [data.msg]
      }
    },
    addMessageForUser(state, data) {
      state.directMessages[data.user].push(data.msg)
    },
  },
  actions: {
    refreshSocket(context, data) {
      context.commit("setMessagesHistory", data.message)
      context.commit("updateConnectedClients", data.clients)
    },
    sendMessage(context, message) {
      context.state.chatSocket &&
        context.state.chatSocket.send(JSON.stringify(message))
    },
    addMessageToDirectHistory(context, data) {
      if (context.state.username == data.user) {
        if (!context.state.directMessages[context.state.selectedUser]) {
          context.commit("setMessagesForUser", {
            user: context.state.selectedUser,
            msg: data,
          })
        } else {
          context.commit("addMessageForUser", {
            user: context.state.selectedUser,
            msg: data,
          })
        }
      } else {
        if (!context.state.directMessages[data.user]) {
          context.commit("setMessagesForUser", {
            user: data.user,
            msg: data,
          })
        } else {
          context.commit("addMessageForUser", {
            user: data.user,
            msg: data,
          })
        }
      }
    },
  },
  getters: {
    messagesToDisplay(state) {
      let msgs = state.selectedUser
        ? state.directMessages[state.selectedUser]
        : state.messagesHistory
      return msgs || []
    },
  },
})
