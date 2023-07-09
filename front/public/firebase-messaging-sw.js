importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "ef258bcc16f703c4c0edff9e4345a6e9",
  authDomain: "project-pinned-84244.firebaseapp.com",
  projectId: "project-pinned-84244",
  storageBucket: "project-pinned-84244.appspot.com",
  messagingSenderId: "317205028283",
  appId: "1:317205028283:web:6b37c867037830ce58f89e",
});

const messaging = firebase.messaging();

self.addEventListener("push", function (event) {
  // 받은 푸시 데이터를 처리해 알림으로 띄우는 내용
});

self.addEventListener("notificationclick", {
  // 띄운 알림창을 클릭했을 때 처리할 내용
});
