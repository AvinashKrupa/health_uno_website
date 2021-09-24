importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "AIzaSyC13l6rYFIL_bhA4hRrnspnN10GyJ3nsTQ",
    authDomain: "healthuno-df503.firebaseapp.com",
    projectId: "healthuno-df503",
    storageBucket: "healthuno-df503.appspot.com",
    messagingSenderId: "591978792926",
    appId: "1:591978792926:web:1370ed45774e70f2107f4f",
    measurementId: "G-XQB6WT9DBL"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/logo192.png",
    };
    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});
