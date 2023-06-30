"""
URL configuration for project_pinned project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include


api_v1_patterns = [
    # url will be looks like http://{host}/api/v1/user/~
    path('user/', include('apps.user.urls')),

    # url will be looks like http://{host}/api/v1/post/~
    path('post/', include('apps.post.urls')),

    # url will be looks like http://{host}/api/v1/landmark/~
    path('landmark/', include('apps.landmark.urls')),
]

api_v2_patterns = [

]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1_patterns)),
    path('api/v2/', include(api_v2_patterns)),
]
