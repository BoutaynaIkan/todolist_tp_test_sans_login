from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False)

    def __str__(self):
        return self.name

class Task(models.Model):
    description = models.TextField(blank=False)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.description

    def mark_as_complete(self):
        self.is_completed = True
        self.save()
