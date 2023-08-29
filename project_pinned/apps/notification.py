import os
import firebase_admin

from firebase_admin import messaging
from firebase_admin import credentials

from project_pinned.settings.base import BASE_DIR


def send_notifiaction(target_user, title, content):
    firebase_manager = FirebaseManager.getInstance()
    try:
        registration_token = target_user.device.first().fcmToken
        firebase_manager.send_notification_with_fcm(
            registration_token, title, content
        )
        print("Notifiacton sent successfully.")

    except AttributeError:
        print("User's device not found.")


class FirebaseManager:
    _instance = None
    _initialized = False

    @staticmethod
    def getInstance():
        if FirebaseManager._instance is None:
            FirebaseManager._instance = FirebaseManager()
        return FirebaseManager._instance

    def __init__(self):
        if FirebaseManager._instance is not None:
            raise Exception("You Cannot Create Another FirebaseManager Class")

        if not FirebaseManager._initialized:
            cred_path = os.path.join(BASE_DIR, "serviceAccountKey.json")
            cred = credentials.Certificate(cred_path)
            self.app = firebase_admin.initialize_app(cred)
            FirebaseManager._initialized = True

