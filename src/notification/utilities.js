import {getData, storeData} from "../storage/LocalStorage/LocalAsyncStorage";
import firebase, {FIREBASE_VAPID_KEY} from "./firebase";
import {getMessaging, getToken, isSupported} from "firebase/messaging";

const messaging = isSupported() && getMessaging(firebase);
export const getPushToken = async () => {
    if(isSupported()){
        const pushToken = getData('PUSH_TOKEN');
    if (pushToken) {
        return pushToken
    } else {
        getToken(messaging, {vapidKey: FIREBASE_VAPID_KEY}).then((currentToken) => {
            if (currentToken) {
                storeData('PUSH_TOKEN', currentToken);
            } else {
                return '';
            }
        }).catch((err) => {
            return '';
        });
    }
 }
}
