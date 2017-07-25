
from . import APP_NAME, __version__
from django.shortcuts import render_to_response, HttpResponse, redirect, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from cartoview.app_manager.models import AppInstance, App
import json
from django.conf import settings
from cartoview_map_viewer import views as viewer_views
from .viewer_widgets import widgets
from django.contrib.auth.decorators import login_required
from cartoview_attachment_manager.dynamic import create_file_model, check_table_exists
from django.core import serializers

VIEW_MAP_TPL = "%s/storymap.html" % APP_NAME

@login_required
def view_app(request, instance_id):
    context = dict(v=__version__)
    return viewer_views.view_app(request, instance_id, template=VIEW_MAP_TPL, context=context)

@login_required
def new(request):
    context = dict(widgets=widgets)
    return viewer_views.new(request, template="%s/edit.html" % APP_NAME, app_name=APP_NAME, context=context)

@login_required
def edit(request, instance_id):
    context = dict(widgets=widgets)
    return viewer_views.edit(request, instance_id, template="%s/edit.html" % APP_NAME, context=context)

@login_required
def images(request):
    layer = request.GET.get("layer", None)
    if layer is not None and check_table_exists(table_name='attachment_manager_file_%s' % layer):
        model = create_file_model(layer)
        res_json = serializers.serialize("json", model.objects.all(), ensure_ascii=False, fields=['feature'],)
        return HttpResponse(res_json, content_type="text/json")
    return HttpResponse("[]", content_type="text/json")
