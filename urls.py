from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView
from . import views, APP_NAME

urlpatterns = patterns('',
   # apps urls
   url(r'^new/$', views.new, name='%s.new' % APP_NAME),
   url(r'^(?P<instance_id>\d+)/edit/$', views.edit, name='%s.edit' % APP_NAME),
   url(r'^(?P<instance_id>\d+)/view/$', views.view_app , name='%s.view' % APP_NAME),
   url(r'^images/$', views.images, name='%s.images' % APP_NAME),
)
