import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.core.exceptions import ValidationError
from todolist.models import Task, Category
from rest_framework import status


pytestmark = pytest.mark.django_db # Applique le marqueur django_db à tous les tests de ce fichier pour permettre l'accès à la base de données.

# Tests unitaires pour les modèles Category et Task
def test_task_uncompleted(create_task, create_category):
    """Vérifie qu'une tâche nouvellement créée a le statut non terminée."""
    
    category = create_category("Test Category")
    task = create_task("Test Task", category)

    assert task.is_completed is False

def test_is_completed_method(create_task, create_category):
    """Vérifie que la méthode is_completed retourne le bon statut de la tâche."""
    category = create_category("Test Category")
    task = create_task("Test Task", category)
    
    task.mark_as_complete()
    task.refresh_from_db()
    
    assert task.is_completed is True

def test_create_task_without_category_is_invalid():
    """Vérifie qu'une tâche ne peut pas être créée sans catégorie."""
    task = Task(description="Test Task", category=None)
    with pytest.raises(ValidationError):
        task.full_clean()

def test_create_task_with_non_existant_category_is_invalid():
    """Vérifie qu'une tâche ne peut pas être créée avec une catégorie inexistante."""
    task = Task(description="Test Task", category_id=9999)  # Utilise un ID de catégorie qui n'existe pas
    with pytest.raises(ValidationError):
        task.full_clean() 


# Tests d'intégration (API)


def test_authenticated_user_can_create_task_api(api_client, user, create_category):
    """Vérifie que l'utilisateur peut créer une tâche via l'API en lui associant une catégorie existante."""
    # Crée un utilisateur et l'authentifie pour l'API afin de simuler un utilisateur connecté.
    test_user = user()
    api_client.force_authenticate(user=test_user)

    # Crée une catégorie pour associer la tâche.
    category = create_category("Test Category")

    # Prépare les données pour la création de la tâche via l'API.
    response = api_client.post(reverse("task-list-create"), data={
        "description": "Test Task",
        "category": category.id
    },
        format='json',
    )

    # Vérifie que la réponse de l'API indique que la tâche a été créée avec succès.
    assert response.status_code == 201

    # Récupère la tâche créée depuis la base de données pour vérifier ses attributs.
    task = Task.objects.get(id=response.data["id"])
    assert task.description == "Test Task"
    assert task.category_id == category.id
    assert task.is_completed is False 

def test_description_is_missing(api_client, user, create_category):
    """Vérifie que l'API renvoi 400 lorsque la description est absente du JSON."""
    # Crée un utilisateur et l'authentifie pour l'API afin de simuler un utilisateur connecté.
    test_user = user()
    api_client.force_authenticate(user=test_user)

    # Crée une catégorie pour associer la tâche.
    category = create_category("Test Category")

    url = reverse("task-list-create")
    # Prépare les données pour la création de la tâche via l'API avec une description manquante.
    response = api_client.post(url, {
        "category": category.id,
    },
        format='json',
    )

    # Vérifie que la réponse de l'API indique une erreur de validation pour la description manquante.
    assert response.status_code == 400
    assert "description" in response.data
    # Vérifie qu'aucune tâche n'a été créée dans la base de données après l'échec de la validation.
    assert Task.objects.count() == 0

@pytest.mark.xfail(reason="Authentification non implémentée dans le projet : l'API est publique.")
def test_error_when_user_is_not_authenticated(api_client, create_category):
    """Vérifie que l'API renvoie une erreur lorsque l'utilisateur n'est pas authentifié."""
   
    url = reverse("task-list-create")
    
    # Crée une catégorie pour associer la tâche.
    category = create_category("Test Category")

    # Tente de créer une tâche via l'API sans authentification.
    response = api_client.post(url, {
        "description": "Test Task",
        "category": category.id,
    },
        format='json',
    )

    # Vérifie que la réponse de l'API indique une erreur d'authentification.
    assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]


def test_filter_tasks_by_category(api_client, user, create_category, create_task):
    """Vérifie que l'API filtre correctement les tâches par catégorie."""
    # Crée un utilisateur de test et l'authentifie pour l'API afin de simuler un utilisateur connecté.
    test_user = user()
    api_client.force_authenticate(user=test_user)

    # Crée deux catégories pour tester le filtrage des tâches par catégorie.
    category1 = create_category("Category 1")
    category2 = create_category("Category 2")

    # Crée deux tâches associées aux catégories respectives pour tester le filtrage.
    create_task("Task 1", category1)
    create_task("Task 2", category2)

    # Prépare l'URL pour récupérer les tâches filtrées par la première catégorie.
    url = reverse("task-list-create")
    response = api_client.get(url, {"category_id": category1.id})

    # Vérifie que la réponse de l'API contient uniquement la tâche associée à la première catégorie.
    assert response.status_code == 200
    # Vérifie que la tâche retournée correspond bien à la catégorie filtrée.
    assert len(response.data) == 1
    assert response.data[0]["description"] == "Task 1"
    assert response.data[0]["category"] == category1.id

def test_delete_task(api_client, user, create_category, create_task):
    """Vérifie que l'API supprime correctement une tâche."""
    # Crée un utilisateur de test et l'authentifie pour l'API afin de simuler un utilisateur connecté.
    test_user = user()
    api_client.force_authenticate(user=test_user)

    # Crée une catégorie et une tâche associée pour tester la suppression.
    category = create_category("Category for Deletion")
    task = create_task("Task to Delete", category)

    url = reverse("task-detail", args=[task.id])
    response = api_client.delete(url)

    # Vérifie que la réponse de l'API indique une suppression réussie.
    assert response.status_code == 204
    # Vérifie que la tâche a bien été supprimée de la base de données.
    assert not Task.objects.filter(id=task.id).exists()

@pytest.mark.xfail(reason="Pas de champ propriétaire sur Task ni d'authentification : l'API est publique.")
def test_delete_task_other_user(api_client, user, other_user, create_category, create_task):
    """Vérifie que l'API empêche un utilisateur de supprimer une tâche appartenant à un autre utilisateur."""
    # Crée deux utilisateurs de test.
    test_user = user()
    test_user_2 = other_user()
    api_client.force_authenticate(user=test_user)

    # Crée une catégorie et une tâche associée à l'autre utilisateur.
    category = create_category("Category for Other User")
    task = create_task("Task of Other User", category)
    task.user = test_user_2
    task.save()
    
    url = reverse("task-detail", kwargs={'pk': task.id})
    response = api_client.delete(url)

    # Vérifie que la réponse de l'API indique une erreur d'autorisation.
    assert response.status_code == status.HTTP_404_NOT_FOUND
    # Vérifie que la tâche n'a pas été supprimée de la base de données.
    assert Task.objects.filter(id=task.id).exists()