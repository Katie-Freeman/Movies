
const chatTextBox = document.getElementById('chatTextBox')
const userName = document.getElementById('userName')
const sendMessageBtn = document.getElementById("sendMessageBtn")
const messagesUL = document.getElementById('messagesUL')


sendMessageBtn.addEventListener('click', function() {
    const username = userName.value
    const chatText = chatTextBox.value
    const chatMessage = {message: chatText, username: username}
    console.log(chatMessage)
    socket.emit('Houston', chatMessage)
    console.log(socket)
})

socket.on('Houston', (chat) => {
    console.log(chat)
    const messageItem =`<li>${chat.username} - ${chat.message}</li>`
    messagesUL.insertAdjacentHTML('beforeend', messageItem)
})