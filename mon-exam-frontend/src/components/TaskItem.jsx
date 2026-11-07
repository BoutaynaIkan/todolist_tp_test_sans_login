import { useState } from 'react';


function TaskItem({ task, onDeleteTask, onCheckboxChange, onUpdateTask , categories, isUpdatingTask, isDeletingTask }) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedCategory, setEditedCategory] = useState(task.category);
  const [updateError, setUpdateError] = useState(null);
  const[deleteError, setDeleteError] = useState(null);

  const isDeleting = isDeletingTask === task.id;
  const isUpdating = isUpdatingTask === task.id;


  
  // Gestion de la soumission du formulaire de mise à jour d'une tâche
  // Catch les erreurs : affiche les erreurs de validation (description et catégorie) sous le champs concerné
  // ou affiche un message générique (general) pour les autres erreurs.
  const handleSave = async () => {
    setUpdateError(null);
    try {
      await onUpdateTask(task.id, editedDescription.trim(), Number(editedCategory));
      setIsEditing(false);
    } catch (error) {
      const data = error.response?.data;
      if (data?.description || data?.category) {
        setUpdateError(error.response?.data || { general: ['Erreur lors de la mise à jour de la tâche. Veuillez réessayer.']});
      } else {
        setUpdateError({ general: ['Erreur lors de la mise à jour de la tâche. Veuillez réessayer.']});
      }
    }
  };

  // Récupère le nom de la catégorie associée à la tâche pour l'afficher dans la liste des tâches
  const categoryName = categories.find(cat => cat.id === task.category)?.name;

  // Gestion de l'annulation de la modification d'une tâche. Réinitialise les champs du formulaire aux valeurs initiales et quitte le mode édition.
  const handleCancel = () => {
    setEditedDescription(task.description);
    setEditedCategory(task.category);
    setIsEditing(false);
  };

  // Gestion du changement de l'état de la checkbox d'une tâche. Appelle la fonction onCheckboxChange passée en props pour mettre à jour l'état de la tâche dans le backend.
  // Catch les erreurs de serveur et les affiche dans le formulaire. Affiche un message générique en cas d'erreur.
  const handleCheckboxChange = async () => {
    try {
      await onCheckboxChange(task.id);
    } catch (error) {
      const data = error.response?.data;
        setUpdateError({ general: [data?.detail || 'Erreur lors de la mise à jour de l\'état de la tâche. Veuillez réessayer.']});
    } 
  };

  // Gestion de la suppression d'une tâche. Affiche une confirmation avant de supprimer et catch les erreurs de serveur.
  const handleDelete = async () => {
    const confirmed = window.confirm('Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette tâche ?');
    if (!confirmed) return;
    setDeleteError(null);

    try {
      await onDeleteTask(task.id);
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors de la suppression de la tâche. Veuillez réessayer.';
      setDeleteError(message);
    }
  };

  // Affiche le formulaire de modification si isEditing est true, sinon affiche la tâche avec ses actions (modifier, supprimer, checkbox). Affiche les messages d'erreur si nécessaire.
  if (isEditing) {
    return (
      <li className="task-item-editing">
        <textarea
          className="edit-task-input"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
        />
        {updateError?.description && <p className="error-message" style={{color: 'red'}}>{updateError.description[0]}</p>}
        <select className="edit-task-category" value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)}>
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {updateError?.category && <p className="error-message" style={{color: 'red'}}>{updateError.category[0]}</p>}
        {updateError?.general && <p className="error-message" style={{color: 'red'}}>{updateError.general[0]}</p>}
        <div className="task-actions">
          <button className="save-task" onClick={handleSave} disabled={isUpdating}>{isUpdating ? 'Enregistrement en cours...' : 'Enregistrer'}</button>
          <button className="cancel-task" onClick={handleCancel}>Annuler</button>
        </div>
      </li>
    );
  } 
  return (
    <li className="task-item" data-cy={`task-item-${task.id}`}>
      <div className="task-content">
        <input type="checkbox" checked={task.is_completed} onChange={handleCheckboxChange} disabled={isUpdating} id="check-task" data-cy="check-task" /> 
        <span style={{ fontStyle: 'italic', color: 'black', textDecoration: task.is_completed ? 'line-through' : 'none', marginLeft: '10px' }}> {task.description} - {categoryName}</span>
      </div>
      {updateError?.general && <p className="error-message" style={{color: 'red'}}>{updateError.general[0]}</p>}
      <div className="task-actions">
        {!task.is_completed && (
          <button id="edit-task" data-cy="edit-task" onClick={() => setIsEditing(true)}>Modifier</button>
        )}
        <button
          id="task-delete"
          data-cy="delete-task"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Suppression en cours...' : 'Supprimer'}
        </button>
        {deleteError && <p className="error-message" style={{color: 'red'}}>{deleteError}</p>}
      </div>
    </li>
  )
}

export default TaskItem