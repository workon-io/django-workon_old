from django.conf.urls import url
from workon.contrib.auth import views

urlpatterns = [
    url(r"^activate/(?P<token>\w{10,64})/$", views.Activate.as_view(), name="auth-activate"),
]