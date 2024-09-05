from django.db import models
from django.conf import settings
from django.utils import timezone

class Schedule(models.Model):
    title = models.CharField(max_length=200)
    text = models.TextField()
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(default=timezone.now)

    def to_json(self):
        return {
            "title": self.title,
            "content": self.text,
            "start_time": self.start_time,
            "end_time": self.end_time
        }

    def __str__(self):
        return self.title