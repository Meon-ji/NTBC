from django.urls import path
from . import views

urlpatterns = [
    path('', views.calendar, name='calendar'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),
    path('detail/', views.detail, name='detail'),
    path('update/', views.update, name='update'),
]