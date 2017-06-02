from django.conf.urls import url
from workon.contrib.auth.views import (
    activate
)

urlpatterns = [
    url(r"^activate/(?P<token>\w{10,64})/$", activate.Activate.as_view(), name="auth-activate"),
]