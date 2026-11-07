from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer 
from django.http import JsonResponse



class CategoryListCreateView(APIView):
    """
    View pour la liste et la création des catégories.
    """ 
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskListCreateView(APIView):
    """
    View pour la liste et la création des tâches.
    """

    def get(self, request):
        tasks = Task.objects.all()
        category_id = request.query_params.get('category_id')
        if category_id:
            tasks = tasks.filter(category_id=category_id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailView(APIView):
    """
    View pour la récupération, la mise à jour et la suppression d'une tâche spécifique.
    """

    def patch(self, request, pk):
        task = get_object_or_404(Task, pk=pk)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = get_object_or_404(Task, pk=pk)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



def health_check(request):
    """Une vue simple qui renvoie un statut de succès."""
    return JsonResponse({"status": "ok", "message": "API is healthy"})


def trigger_error(request):
    """Une vue conçue pour créer une erreur 500."""
    # Cette ligne va inévitablement provoquer une erreur
    division_by_zero = 1 / 0
    return JsonResponse({"this": "will never be returned"})