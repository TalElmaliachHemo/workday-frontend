import io from 'socket.io-client'
import { userService } from './user.service'
export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EMIT_TYPING = 'chat-typing'
export const SOCKET_EVENT_TYPING = 'chat-user-typing'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'
export const SOCKET_EVENT_UPDATE_USERS = 'update-users'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'


const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'
export const socketService = createSocketService()

// for debugging from console
// window.socketService = socketService

socketService.setup()


function createSocketService() {
  var socket = null;
  const socketService = {
    setup() {
      socket = io(baseUrl)
      setTimeout(()=>{
        const user = userService.getLoggedinUser()
        // Setting the user ID on the socket for identification in the backend!
        if (user) this.login(user._id)
      }, 500)
    },
    on(eventName, cb) {
      socket.on(eventName, cb)
    },
    off(eventName, cb = null) {
      if (!socket) return;
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName, data) {
      socket.emit(eventName, data)
    },
    login(userId) {
      socket.emit(SOCKET_EMIT_LOGIN, userId)
    },
    logout() {
      socket.emit(SOCKET_EMIT_LOGOUT)
    },
    terminate() {
      socket = null
    },

  }
  return socketService
}