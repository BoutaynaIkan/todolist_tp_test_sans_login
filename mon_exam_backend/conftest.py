import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_category(db):
    from todolist.models import Category
    def make_category(name):
        category = Category.objects.create(name=name)
        return category
    return make_category

@pytest.fixture
def create_task(db):
    from todolist.models import Task
    def make_task(description, category):
        task = Task.objects.create(description=description, category=category)
        return task
    return make_task

@pytest.fixture
def user(db, django_user_model):
    def make_user(username="testuser", password="password123"):
        user = django_user_model.objects.create_user(username=username, password=password)
        return user
    return make_user

@pytest.fixture
def other_user(db, django_user_model):
    def make_other_user(username="otheruser", password="password123"):
        user = django_user_model.objects.create_user(username=username, password=password)
        return user
    return make_other_user

