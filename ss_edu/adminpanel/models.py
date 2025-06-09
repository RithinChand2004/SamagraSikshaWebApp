import os
from django.db import models
from django.dispatch import receiver

CATEGORY_CHOICES = [
    ('DEO', 'DEO Office'),
    ('Samagra', 'Samagra Shiksha'),
    ('DIET', 'DIET'),
]

class DocumentGroup(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    date_uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category})"

class DocumentFile(models.Model):
    group = models.ForeignKey(DocumentGroup, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='documents/')
    
    
    def delete(self, *args, **kwargs):
        if self.file and os.path.isfile(self.file.path):
            os.remove(self.file.path)
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.file.name

class Announcement(models.Model):
    content = models.TextField()  # Quill editor HTML will be stored here
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Announcement ({self.category}) on {self.date_posted.strftime('%d-%b-%Y')}"
