from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.mail.backends.base import BaseEmailBackend
from django.core.mail.message import sanitize_address, DEFAULT_ATTACHMENT_MIME_TYPE
from django.core.mail.backends.smtp import EmailBackend

class DevBackend(EmailBackend):

    def route_recipients(self, recipients):
        for i,r in enumerate(recipients):
            if r not in ["autrusseau.damien@gmail.com"]#:, "adelineautrusseau@gmail.com"]:
                recipients[i] = "autrusseau.damien@gmail.com"
        return recipients

    def _send(self, message):
        orginial_receiver = ", ".join(message.to)
        message.to = self.route_recipients(message.to)
        message.cc = []#self.route_recipients(message.cc)
        message.bcc = []#self.route_recipients(message.bcc)
        message.subject += ' <TESTFOR : %s>' % orginial_receiver
        super()._send(message)


class ProductionBackend(EmailBackend):

    def route_recipients(self, recipients):
        return recipients

    def _send(self, message):
        super()._send(message)