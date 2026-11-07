import { useState } from 'react';


function AddTask({ onAddTask, categories, isLoading, error }) {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [errors, setErrors] = useState({});

    // Gestion de la soumission du formulaire d'ajout d'une nouvelle tâche
    // Catch les erreurs de validation et les affiche dans le formulaire. Erreur de description vide ou catégorie non sélectionnée.
    // Pour les erreurs de serveur, affiche un message générique.
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onAddTask({description: description.trim(), category: category ? Number(category) : null});
            setDescription('');
            setCategory('');
            setErrors({});
        } catch (error) {
            const data = error.response?.data;
            if (data?.description || data?.category) {
                setErrors({
                    description: data.description?.[0],
                    category: data.category?.[0],
                });
            } else {
                setErrors({ general: data?.detail || 'Erreur lors de l\'ajout de la tâche. Veuillez réessayer.' });
            }
        }
    }

  return (
    <div className="task-form-card">
      <h3>Ajouter une nouvelle tâche</h3>
      <form className="add-task-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Nouvelle tâche" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          id='new-task-input'
          data-cy="new-todo-input"
        />
        {errors.description && <p className="error-message" style={{color: 'red'}}>{errors.description}</p>}
        <div className="form-row">
        <select value={category} onChange={(e) => setCategory(e.target.value)} id='new-todo-category' data-cy="new-todo-category">
          <option value="" disabled>
            Sélectionner une catégorie
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" id="new-todo-submit" data-cy="new-todo-submit" disabled={isLoading}>
          {isLoading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
        </div>
        {errors.category && <p className="error-message" style={{color: 'red'}}>{errors.category}</p>}
        {(errors.general || error) && <p className="error-message" style={{color: 'red'}}>{errors.general || error}</p>}
      </form>
    </div>
  )
}


export default AddTask