
import { useState, useEffect } from 'react'
import AddCategory from './components/AddCategory'
import AddTask from './components/AddTask'
import TaskList from './components/TaskList'
import { apiClient } from './api';
import { Login } from './components/Login';

// URL de l'API backend

function App() {
  const [credentials, setCredentials] = useState(null);
  

  // Données
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  // GET initial
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //POST
  const[isAddingCategory, setIsAddingCategory] = useState(false);
  const[isAddingTask, setIsAddingTask] = useState(false);
  
  //DELETE
  const[isDeletingTask, setIsDeletingTask] = useState(null);

  //PATCH
  const[isUpdatingTask, setIsUpdatingTask] = useState(null);

  // Récupère les catégories et les tâches depuis le backend au chargement du composant. Catch les erreurs de serveur et les affiche dans le composant.
  useEffect(() => {
    if (!credentials) return;
    const fetchTasks = async () => {
      try {
        const [categoriesResponse, tasksResponse] = await Promise.all([
          apiClient.get(`/categories/`),
          apiClient.get(`/tasks/`)
        ]);
        setCategories(categoriesResponse.data);
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [credentials]);

  // Gestion de l'ajout d'une nouvelle catégorie. Catch les erreurs de serveur et les affiche dans le composant AddCategory.
  const handleAddCategory = async (newCategory) => {
    setIsAddingCategory(true);
    try {
      const response = await apiClient.post(`/categories/`, { name: newCategory });
      setCategories([...categories, response.data]);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error; // Rethrow l'erreur pour qu'elle soit gérée dans le composant AddCategory
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Gestion de l'ajout d'une nouvelle tâche. Catch les erreurs de serveur et les affiche dans le composant AddTask.
  const handleAddTask = async (newTask) => {
    setIsAddingTask(true);
  
    try {
      const response = await apiClient.post(`/tasks/`, newTask);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error; // Rethrow l'erreur pour qu'elle soit gérée dans le composant AddTask
    } finally {
      setIsAddingTask(false);
    }
  };

  // Gestion de la suppression d'une tâche. Catch les erreurs de serveur et les affiche dans le composant TaskItem.
  const handleDeleteTask = async (id) => {
    setIsDeletingTask(id);
    try {
      await apiClient.delete(`/tasks/${id}/`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error; // Rethrow l'erreur pour qu'elle soit gérée dans le composant TaskItem
    } finally {
      setIsDeletingTask(null);
    }
  };

  // Gestion du changement de l'état de la checkbox d'une tâche. Catch les erreurs de serveur et les affiche dans le composant TaskItem.
  const handleCheckboxChange = async (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;
    setIsUpdatingTask(id);

    try {
      const response = await apiClient.patch(`/tasks/${id}/`, { is_completed: !taskToUpdate.is_completed });
      setTasks(tasks.map(task => 
        task.id === id ? response.data : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error; // Rethrow l'erreur pour qu'elle soit gérée dans le composant TaskItem
    } finally {
      setIsUpdatingTask(null);
    }
  };

  // Gestion de la mise à jour d'une tâche. Catch les erreurs de serveur et les affiche dans le composant TaskItem.
  const handleUpdateTask = async (id, description, category) => {
    setIsUpdatingTask(id);
    try {
      const updatedTask = { description, category };
      await apiClient.patch(`/tasks/${id}/`, updatedTask);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error; // Rethrow l'erreur pour qu'elle soit gérée dans le composant TaskItem
    } finally {
      setIsUpdatingTask(null);
    }
  };

  // Filtre les tâches en fonction de la catégorie sélectionnée. Si aucune catégorie n'est sélectionnée, affiche toutes les tâches.
  const filteredTasks = selectedCategory
    ? tasks.filter(task => task.category === Number(selectedCategory))
    : tasks;

  if (!credentials) {
    return <Login onLoginSuccess={(email, password) => setCredentials({ email, password })} />;
  }

  if (isLoading) {
    return <p>Chargement des tâches...</p>;
  }

  if (error) {
    return <p role='alert' style={{ color: 'red' }}>{error}</p>;
  }




  return (
    <>
      <h1>Ma To-Do List par Catégories</h1>

      <div className="form-container">
        <AddCategory onAddCategory={handleAddCategory} isLoading={isAddingCategory} />
        <AddTask onAddTask={handleAddTask} categories={categories} isLoading={isAddingTask}/>
      </div>
      <div className="list-header">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} id='select-category' data-cy="todo-list-category-filter">
          <option value="" disabled>
              Sélectionner une catégorie
          </option>
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </select>
      </div>
      <TaskList tasks={filteredTasks} onDeleteTask={handleDeleteTask} onCheckboxChange={handleCheckboxChange} onUpdateTask={handleUpdateTask} categories={categories} isUpdatingTask={isUpdatingTask} isDeletingTask={isDeletingTask} credentials={credentials} />
    </>
  )
}

export default App
