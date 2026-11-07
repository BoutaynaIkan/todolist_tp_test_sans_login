import { useState } from 'react'


function AddCategory({ onAddCategory, isLoading }) {
  const [categoryName, setCategoryName] = useState('')
  const [localError, setLocalError] = useState(null)
  
  // Gestion de la soumission du formulaire d'ajoiut d'une nouvelle catégorie
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLocalError(null)
      await onAddCategory(categoryName.trim())
      setCategoryName('')
  
    } catch (error) {
      const message = error.response?.data?.name?.[0] || 'Erreur lors de l\'ajout de la catégorie. Veuillez réessayer.' // Récupère le message d'erreur spécifique ou un message générique
      setLocalError(message)
    }
  }


  return (
    <div className="category-form-card">
      <h3>Ajouter une nouvelle catégorie</h3>
      <form className="add-category-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nouvelle catégorie"
            id='new-category-input'
            data-cy="new-category-input"
          />
          {localError && <p className="error-message" >{localError}</p>}
          <button type="submit" id='new-category-submit' data-cy="new-category-submit" disabled={isLoading}>
            {isLoading ? 'Ajout en cours...' : 'Ajouter catégorie'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;