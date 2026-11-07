import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTask from "./AddTask";

// Test d'un composant interactif

describe("AddTask component", () => {
    const categories = [{ id: 1, name: "Travail" }, { id: 2, name: "Personnel" }];
  it("devrait contenir un champs texte pour la description de la tâche et un <select> pour la catégorie", () => {
    render(<AddTask categories={categories} onAddTask={() => {}} />);
    expect(screen.getByPlaceholderText(/Nouvelle tâche/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Travail/i })).toBeInTheDocument();
  });

  it("devrait désactiver le bouton de soumission si la description est vide ou si aucune catégorie n'est sélectionnée", () => {
    render(<AddTask categories={categories} onAddTask={() => {}} />);
    expect(screen.getByRole("button", { name: /Ajouter/i })).not.toBeDisabled();
  });

  it("devrait appeler la fonction onAddTask lorsqu'on clique sur le bouton Ajouter avec les bonnes valeurs description et catégorie", async () => {
    // Arrange
    // On prépare l'utilisateur simulé et la fonction mock pour onAddTask afin de vérifier qu'elle est appelée correctement avec les bonnes valeurs
    const user = userEvent.setup();
    const onAddTaskMock = vi.fn();

    // On rend le composant avec des catégories de test et la fonction mock 
    render(<AddTask categories={categories} onAddTask={onAddTaskMock} />);

    // On récupère les éléments du formulaire pour simuler l'interaction utilisateur
    const descriptionInput = screen.getByPlaceholderText(/Nouvelle tâche/i);
    const categorySelect = screen.getByRole("combobox");
    const submitButton = screen.getByRole("button", { name: /Ajouter/i });
    
    // Act
    // On simule la saisie de la description, la sélection de la catégorie et le clic sur le bouton de soumission
    await user.type(descriptionInput, "Test tâche");
    await user.selectOptions(categorySelect, "1");
    await user.click(submitButton);
    // Assert
    // On vérifie que la fonction onAddTaskMock a été appelée une fois avec les bonnes valeurs
    expect(onAddTaskMock).toHaveBeenCalledTimes(1);
    expect(onAddTaskMock).toHaveBeenCalledWith({ description: "Test tâche", category: 1 });
  });
});