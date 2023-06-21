# from django.shortcuts import render
from django.http import HttpResponse
from django.views import View


class UserViewTest(View):
    def get(self, request):
        return HttpResponse("Hello This is user app.")
