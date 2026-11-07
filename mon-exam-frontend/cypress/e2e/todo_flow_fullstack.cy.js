describe("Todo Flow Fullstack", () => {
  it("should allow a user to log in and manage todos", () => {

    const newCategory = `Projet Alpha ${Date.now()}`
    const newTaskTitle = `Déployer la V1 ${Date.now()}`

    // Se connecter à l'application avant de commencer les tests
    // Connexion simulée côté frontend : l'API n'a pas d'authentification (hors périmètre initial)
    cy.login();

    // Intercepter la requête pour ajouter une catégorie afin de pouvoir attendre sa complétion
    cy.intercept("POST", "http://localhost:8000/api/categories/").as("addCategory");

    // Ajouter une nouvelle catégorie 
    cy.get('[data-cy="new-category-input"]').type(newCategory);
    cy.get('[data-cy="new-category-submit"]').click();

    // Attendre que la requête d'ajout de catégorie soit terminée avant de continuer
    cy.wait("@addCategory");
    // Vérifier que la nouvelle catégorie a bien été ajoutée à la liste des catégories
    cy.contains(newCategory).should("exist");
    cy.get('[data-cy="todo-list-category-filter"]').contains(newCategory).should("exist");
    

    // Intercepter la requête pour ajouter une tâche afin de pouvoir attendre sa complétion
    cy.intercept("POST", "http://localhost:8000/api/tasks/").as("addTask");
    // Ajouter une nouvelle tâche avec le titre et la catégorie spécifiés
    cy.get('[data-cy="new-todo-input"]').type(newTaskTitle);
    cy.get('[data-cy="new-todo-category"]').select(newCategory);
    cy.get('[data-cy="new-todo-submit"]').click();
   // Attendre que la requête d'ajout de tâche soit terminée avant de continuer
    cy.wait("@addTask");
    // Vérifier que la tâche ajoutée est bien visible après l'ajout
    //cy.reload(); je ne reload pas car je perds le statut de connecté comme je l'ai configuré uniquement pour le test rapidemennt
    cy.contains('[data-cy^="task-item-"]', newTaskTitle).should("be.visible");

    //Selectionner la catégorie et filtrer dessus 
    cy.get('[data-cy="todo-list-category-filter"]').select(newCategory);
    cy.get('[data-cy="todo-list"]').contains(newCategory).should("exist");
    cy.contains('[data-cy^="task-item-"]', newTaskTitle).should("be.visible");
    
    //Vérifier que la tâche est toujours visible  en changeant la catégorie à "Toutes les catégories"
    cy.get('[data-cy="todo-list-category-filter"]').select("Toutes les catégories");
    cy.get('[data-cy^="task-item-"]').contains(newTaskTitle).should("be.visible");

    // Marquer la tâche comme complétée et vérifier son état visuel
    cy.contains('[data-cy^="task-item-"]', newTaskTitle).find('[data-cy="check-task"]').click();
    // Vérifier que le texte est barré (line-through) après avoir marqué la tâche comme complétée
    cy.contains('[data-cy^="task-item-"] span', newTaskTitle).should("have.css", "text-decoration-line", "line-through");
    cy.contains('[data-cy^="task-item-"]', newTaskTitle).find('[data-cy="check-task"]').should("be.checked");

    // Supprimer la tâche et vérifier qu'elle n'existe plus dans la liste
    cy.contains('[data-cy^="task-item-"]', newTaskTitle).find('[data-cy="delete-task"]').click();
    cy.contains('[data-cy^="task-item-"]', newTaskTitle).should("not.exist");

    // Vérifier en base que c'est bien supprimé
    cy.request("GET", "http://localhost:8000/api/tasks/").then((response) => {
      const tasks = response.body;
      const taskExists = tasks.some((task) => task.description === newTaskTitle);
      expect(taskExists).to.be.false;
    });
    
  });
});