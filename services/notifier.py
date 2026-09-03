import logging
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

logging.basicConfig(level=logging.INFO)

class SMSNotifier:
    def __init__(self, account_sid: str, auth_token: str, from_number: str):
        self.client = Client(account_sid, auth_token)
        self.from_number = from_number

    def send_sms_safe(self, to_number: str, message_body: str) -> dict:
        """
        Sends an SMS with full exception handling.
        Returns a status dictionary instead of throwing unhandled errors.
        """
        try:
            message = self.client.messages.create(
                body=message_body,
                from_=self.from_number,
                to=to_number
            )
            logging.info(f"SMS sent successfully. SID: {message.sid}")
            return {"status": "success", "sid": message.sid}
        except TwilioRestException as e:
            logging.error(f"Twilio API Failure: {e}")
            return {"status": "failed", "error": str(e)}
        except Exception as e:
            logging.error(f"Unexpected error sending SMS: {e}")
            return {"status": "failed", "error": str(e)}