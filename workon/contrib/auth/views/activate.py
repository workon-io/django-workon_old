from django.conf import settings
from django.core.urlresolvers import NoReverseMatch
from django.views import generic
from django.http import Http404, HttpResponseRedirect, HttpResponseForbidden
from django.contrib import auth, messages
from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from workon.contrib.auth import conf
from workon.contrib.auth.models import ActivationToken
import workon.auth

class Activate(generic.View):

    def get(self, request, token, *args, **kwargs):
        token = workon.auth.get_activation_token(token)
        if token:
            user = token.activate_user()
            if user:
                if workon.auth.authenticate_user(request, user, remember=True):
                    activation_message =conf.ACTIVATION_MESSAGE
                    if activation_message:
                        messages.success(request, activation_message)
                    activation_fallback_url = conf.ACTIVATION_FALLBACK_URL
                    if not activation_fallback_url:
                        return "/"
                    try:
                        return HttpResponseRedirect(reverse(activation_fallback_url))
                    except NoReverseMatch:
                        return HttpResponseRedirect("/%s" % activation_fallback_url.lstrip('/'))
        else:
            raise Http404