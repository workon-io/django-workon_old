from django.conf import settings
from django.views import generic
from django.contrib import auth
from django.shortcuts import redirect
import workon.utils

class Logout(generic.base.TemplateResponseMixin, generic.View):

    template_name = "workon/auth/logout.html"
    redirect_field_name = "next"

    def get_template_names(self):
        return [self.template_name_ajax] if self.request.is_ajax() else [self.template_name]

    def get(self, *args, **kwargs):
        if not self.request.user.is_authenticated():
            return redirect(self.get_redirect_url())
        ctx = self.get_context_data()
        return self.render_to_response(ctx)

    def post(self, *args, **kwargs):
        if self.request.user.is_authenticated():
            auth.logout(self.request)
        return redirect(self.get_redirect_url())

    def get_context_data(self, **kwargs):
        ctx = kwargs
        redirect_field_name = self.get_redirect_field_name()
        ctx.update({
            "redirect_field_name": redirect_field_name,
            "redirect_field_value": self.request.POST.get(redirect_field_name, self.request.GET.get(redirect_field_name, "")),
        })
        return ctx

    def get_redirect_field_name(self):
        return self.redirect_field_name

    def get_redirect_url(self, fallback_url=None, **kwargs):
        if fallback_url is None:
            fallback_url = '/%s' % (settings.PREFIX_URL if hasattr(settings, 'PREFIX_URL') else "")
        kwargs.setdefault("redirect_field_name", self.get_redirect_field_name())
        return workon.utils.default_redirect(self.request, fallback_url, **kwargs)

#     }