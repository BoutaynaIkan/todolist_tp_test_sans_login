from rest_framework import serializers
from .models import Category, Task


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Category. Il inclut la validation pour s'assurer que le nom de la catégorie n'est pas vide.
    """
    name = serializers.CharField(error_messages={'blank': 'Le nom de la catégorie ne peut pas être vide.'})
    class Meta:
        model = Category
        fields = ['id', 'name']
        read_only_fields = ['id']
        validators = []  #Supprime la validation unique par défaut pour gérer l'erreur dans la méthode validate_name

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Le nom de la catégorie ne peut pas être vide.")
        if Category.objects.filter(name=value).exists():
            raise serializers.ValidationError("Une catégorie avec ce nom existe déjà.") 
        return value

class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer pour la lecture,la création des tâches et la mise à jour partielle. Il inclut la validation pour s'assurer que la description de la tâche n'est pas vide et que la catégorie est sélectionnée.
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    description = serializers.CharField(error_messages={'blank': 'La description de la tâche ne peut pas être vide.'})
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), 
        error_messages={'required': 'Veuillez sélectionner une catégorie.','null': 'Veuillez sélectionner une catégorie.',})

    class Meta:
        model = Task
        fields = ['id', 'description', 'is_completed', 'created_at', 'category' , 'category_name']
        read_only_fields = ['id', 'created_at']

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("La description de la tâche ne peut pas être vide.")
        return value

    def validate_category(self, value):
        if not value:
            raise serializers.ValidationError("Veuillez sélectionner une catégorie.")
        return value
    





