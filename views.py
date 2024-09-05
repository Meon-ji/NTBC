from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.utils.http import urlencode
from django.utils import timezone
from .models import Schedule
from datetime import datetime
import calendar
import json

# Create your views here.
def calendar(request):
    todos = Schedule.objects.all()
    todos_json = json.dumps([{
        'title': todo.title,
        'text' : todo.text,
        'start_time' : todo.start_time.strftime('%Y-%m-%d %H:%M:%S'),
        'end_time': todo.end_time.strftime('%Y-%m-%d %H:%M:%S'),
        'url': f"{reverse('detail')}?{urlencode({'title': todo.title})}"
    } for todo in todos])
    return render(request, 'scheduler/calendar.html', {'todos': todos_json})

def create(request):
    if(request.method == "POST"):
        todo = Schedule()

        todo.title = request.POST['title']
        todo.text = request.POST['text']
        todo.start_time = request.POST['start_time']
        todo.end_time = request.POST['end_time']

        todo.save()
        return redirect('calendar')

def delete(request):
    title = request.GET.get('title')
    delete_todo = get_object_or_404(Schedule, title=title)
    delete_todo.delete()
    return redirect('calendar')

def detail(request):
    title = request.GET.get('title')
    todo = get_object_or_404(Schedule, title=title)
    return render(request, 'scheduler/detail.html', {'todo': todo})

def update(request):
    title = request.GET.get('title')
    todo = get_object_or_404(Schedule, title=title)
    if(request.method == "POST"):
        todo.title = request.POST['title']
        todo.text = request.POST['text']
        todo.start_time = request.POST['start_time']
        todo.end_time = request.POST['end_time']

        todo.save()
        return redirect('calendar')
    else:
        return render(request, 'scheduler/update.html', {'todo':todo})
