import datetime, re
from urllib.parse import urlparse
from premailer import transform
from email.utils import parseaddr
from django.utils import six
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context, RequestContext
from django.utils.html import strip_tags
from django.core.mail import get_connection, EmailMultiAlternatives

_email_regex = re.compile("([a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`"
                    "{|}~-]+)*(@|\sat\s)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(\.|"
                    "\sdot\s))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)")

__all__ = [
    "extract_emails",
    "emails_to_html",
    "extract_emails_to_html",
    "is_valid_email",
    "ContentEmail",
    "HtmlTemplateEmail",
    "send_email",
    "send_mass_email",
    "send_html_email",
    "send_template_email",
    "set_mailchimp_vars",
    "clean_html_for_email",
]


def extract_emails(text):
    if text is not None:
        return list(set((email[0] for email in _email_regex.findall(text) if not email[0].startswith('//'))))
    else:
        return []


def emails_to_html(emails, reverse=True, classname=None, divider="<br />"):
    emails = [
        u'<a href="mailto:%s" %s/>%s</a>' % (
            email,
            ('class="%s" ' % classname) if classname else "",
            email.strip('/')
        ) for email in emails
    ]
    if reverse:
        emails.reverse()
    html = divider.join(emails)
    return html

def extract_emails_to_html(text, **kwargs):
    return emails_to_html(extract_emails(text), **kwargs)

def is_valid_email(email):
    if email is None:
        return None
    result = parseaddr(email.strip().lower())
    if '@' in result[1]:
        return result[1]
    else:
        return None

class ContentEmail(EmailMultiAlternatives):
    def __init__(self, subject, content, sender, receivers, content_type=None, context={}, files=[], **kwargs):

        subject = " ".join(subject.splitlines())
        content = kwargs.pop('body', content)
        if type(receivers) == type(str()) or type(receivers) == type(unicode()):
            receivers = [receivers]
        if content_type:
            super(ContentEmail, self).__init__(subject, '', sender, receivers, **kwargs)
        else:
            super(ContentEmail, self).__init__(subject, content, sender, receivers, **kwargs)

        if content_type:
            self.attach_alternative(content, content_type)
        if files:
            for file in files:
                self.attach(*file)

class HtmlTemplateEmail(EmailMultiAlternatives):

    def __init__(self, subject, html, sender, receivers, context={}, files=[], **kwargs):
        if isinstance(receivers, six.string_types):
            receivers = [receivers]

        subject = " ".join(subject.splitlines())
        text_template = strip_tags(html)
        if kwargs.get('clean_html') == True:
            kwargs.pop('clean_html')
            html = clean_html_for_email(html)
        super(HtmlTemplateEmail, self).__init__(subject, text_template, sender, receivers, **kwargs)
        self.attach_alternative(html, "text/html")
        if files:
            for file in files:
                self.attach(*file)
# django : send_mail(subject, message, from_email, recipient_list, fail_silently=False, auth_user=None, auth_password=None, connection=None, html_message=None)
def send_email(subject, sender, receivers, content=None, template=None, context={}, content_type=None, files=[], **kwargs):
    fail_silently = kwargs.pop('fail_silently', False)
    if template:
        html_template = get_template(template)
        html = html_template.render(context)
        message = HtmlTemplateEmail(subject, html, sender, receivers, context, files=files, **kwargs)
    elif content:
        message = ContentEmail(subject, content, sender, receivers, content_type=content_type, files=files, **kwargs)

    return message.send(fail_silently=fail_silently)

def send_mass_email(messages, **kwargs):
    fail_silently = kwargs.pop('fail_silently', False)
    connection = get_connection()
    connection.open()
    connection.send_messages(messages, fail_silently=fail_silently)
    connection.close()

def send_html_email(subject, sender, receivers, html='', context={}, files=[], **kwargs):
    fail_silently = kwargs.pop('fail_silently', False)
    message = HtmlTemplateEmail(subject, html, sender, receivers, context, files=files, **kwargs)
    return message.send(fail_silently=fail_silently)

def send_template_email(subject, sender, receivers, template=None, context={}, files=[], **kwargs):
    html_template = get_template(template)
    context = Context(context)
    html = html_template.render(context)
    return send_html_email(subject, sender, receivers, html=html, context=context, files=files, **kwargs)


def set_mailchimp_vars(template):
    template = template.replace('*|CURRENT_YEAR|*', str(datetime.date.today().year) )
    return template


def clean_html_for_email(html):
    return transform(html)






