const echoURL = "wss://echo-ws-service.herokuapp.com";
const mapsURL = "https://www.openstreetmap.org/#map=18/";

const websocket = new WebSocket(echoURL);

const statusNode = document.querySelector(".status-offline");
websocket.onopen = (event) => {
  statusNode.classList.toggle("status-online");
  statusNode.textContent = "Сервер онлайн"
}
websocket.onmessage = (event) => {
  // Проверка, не начинается ли ответ сервера со ссылки на карты
  if (!event.data.startsWith(mapsURL)) {
    showMessageInChat(event.data, false);
  }
}
websocket.onerror = (event) => {
  showMessageInChat("Error: " + event.data, false);
}
websocket.onclose = (event) => {
  statusNode.classList.toggle("status-online");
  statusNode.textContent = "Сервер отключен";
}


const inputNode = document.querySelector(".input-wrapper__input");
const buttonSendNode = document.querySelector(".button-send");
const buttonGeolocationNode = document.querySelector(".button-geolocation");
const buttonSendIconNode = document.querySelector(".button-send-icon");
const buttonGeolocationIconNode =
  document.querySelector(".button-geolocation-icon");
const buttonClearIconNode = document.querySelector(".button-clear-icon");
const chatNode = document.querySelector(".chat-wrapper");


chatNode.innerHTML = localStorage.getItem("chatHistory");
chatNode.scrollTop = chatNode.scrollHeight;



// Функция добавления карточки сообщения в окно чата.
function showMessageInChat(message, isClient, link = null) {
  const messageCard = document.createElement("div");

  messageCard.classList.add("chat-wrapper__message");
  messageCard.classList.add(isClient ? "client-message" : "server-message");
  if (link) {
    const linkMessage = document.createElement("a");
    linkMessage.classList.add("link-content");
    linkMessage.textContent = message;
    linkMessage.href = link;
    messageCard.appendChild(linkMessage);
  } else {
    const textMessage = document.createElement("p");
    textMessage.classList.add("text-content");
    textMessage.textContent = message;
    messageCard.appendChild(textMessage);
  }

  // Отображение времени отправки в каждом сообщении
const timestamp = document.createElement("p");
  const currentTime = new Date();
  timestamp.classList.add("timestamp");
  timestamp.textContent = currentTime.toLocaleTimeString();
  messageCard.appendChild(timestamp);

  chatNode.appendChild(messageCard);
  chatNode.scrollTop = chatNode.scrollHeight;

  
  localStorage.setItem("chatHistory", chatNode.innerHTML);
}



buttonSendNode.addEventListener("click", () => {
  const message = inputNode.value;

  // Отправка сообщения в чат и собеседнику только в том случае,
  // если сообщение не пустое.
  if (message) {
    showMessageInChat(message, true);
    // Перед отправкой сообщения серверу, проверка статуса соединения.
    // Если канал закрыт, то сообщение не отправляется.
    if (websocket.readyState) {
      websocket.send(message);
    }
  }
 
  inputNode.value = null;
});



buttonGeolocationNode.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Гео-локация не совместима с вашим браузером");
  } else {

    

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const mapLink = mapsURL + "/" + latitude + "/" + longitude;
        showMessageInChat("Моя локация", true, mapLink);
        websocket.send(mapLink);

        buttonGeolocationNode.classList.toggle("pulse");
        buttonGeolocationIconNode.classList.toggle("pulse");
      },
      () => {
        alert("Извините, мы не можем определить ваше местоположение.");

        buttonGeolocationNode.classList.toggle("pulse");
        buttonGeolocationIconNode.classList.toggle("pulse");
      });
  }
});


buttonSendIconNode.addEventListener("click", () => {
  buttonSendNode.click();
});



buttonGeolocationIconNode.addEventListener("click", () => {
  buttonGeolocationNode.click();
});



buttonClearIconNode.addEventListener("click", () => {
  if (confirm("Вы уверены, что хотите удалить этот диалог?")) {
    chatNode.innerHTML = null;
    localStorage.removeItem("chatHistory");
  }
});



inputNode.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    buttonSendNode.click();
  }
});




