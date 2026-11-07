import { render, screen } from "@testing-library/react";
import TaskItem from "./TaskItem";

// Test d'un composant de présentation
describe("TaskItem component", () => {
    const categories =[{ id: 1, name: "Travail" }, { id: 2, name: "Personnel" }];
    const task = { id: 1, description: "Test Task", category: 1, is_completed: false };
  
    it("devrait afficher le titre de la tâche et le nom de la catégorie", () => {
    render(<TaskItem task={task} categories={categories} />);
    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Travail/i)).toBeInTheDocument();
  });

  it("devrait ne devrait pas barrer le texte ni cocher la case pour une tâche non complétée", () => {
    render(<TaskItem task={task} categories={categories} />);
    expect(screen.getByText(/Test Task/i)).not.toHaveStyle("text-decoration: line-through");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("devrait changer le style si la tâche est complétée", () => {
    const completedTask = { ...task, is_completed: true };
    render(<TaskItem task={completedTask} categories={categories} />);
    expect(screen.getByText(/Test Task/i)).toHaveStyle("text-decoration: line-through");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});