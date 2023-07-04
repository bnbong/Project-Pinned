import os
import firebase_admin

from firebase_admin import messaging
from firebase_admin import credentials

from project_pinned.settings import BASE_DIR


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
    """
    Push 알림을 보내기 위한 Firebase admin app manager.
    해당 firebase admin app은 오직 푸시 알림을 보내는 용도로만 사용하기 때문에
    firebase app 인스턴스는 하나만 생성하고, 이를 싱글톤으로 관리한다.
    """

    _instance = None

    @staticmethod
    def getInstance():
        if FirebaseManager._instance is None:
            FirebaseManager()
        return FirebaseManager._instance

    def __init__(self):
        if FirebaseManager._instance is not None:
            raise Exception("You Cannot Create Another FirebaseManager Class")
        else:
            FirebaseManager._instance = self
            cred_path = os.path.join(BASE_DIR, "serviceAccountKey.json")
            cred = credentials.Certificate(cred_path)
            self.app = firebase_admin.initialize_app(cred)

    def send_notification_with_fcm(self, registration_token, title, body):
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=registration_token,
        )

        try:
            response = messaging.send(message)
            print("Successfully sent message:", response)

        except Exception as e:
            print("Exception occured at notification: ", e)
