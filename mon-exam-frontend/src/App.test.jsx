import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { apiClient } from './api';

// On crée un espion sur la méthode 'get' de l'apiClient pour pouvoir simuler les réponses de l'API dans les tests
const  mockGet = vi.spyOn(apiClient, 'get');

describe('App component', () => {
    // On réinitialise l'espion avant chaque test pour éviter les effets de bord entre les tests
    beforeEach(() => {
        mockGet.mockReset();
    });
    // On restaure l'espion après tous les tests pour ne pas affecter d'autres tests ou modules
    afterAll(() => {
        mockGet.mockRestore();
    });
    
    it('devrait afficher un indicateur de chargement pendant que la promesse API est en cours', async () => {
        
        //Arrange: l'API ne réponds jamais,la promesse reste en attente
        mockGet.mockReturnValue(new Promise(() => {})); // Promesse qui ne se résout jamais
       
        // Act: on rend le composant App, ce qui déclenche l'appel API simulé
        render(<App />);

        // Assert: l'indicateur de chargement est affiché pendant que la promesse est en attente
        expect(await screen.findByText(/Chargement/i)).toBeInTheDocument();

    });

    it("devvrait afficher les tâches une fois que l'API a répondu", async () => {

        // Arrange: l'API renvoie des tâches simulées
        const mockCategories = [
            { id: 1, name: 'Catégorie 1' },
            { id: 2, name: 'Catégorie 2' }
        ];
        const mockTasks = [
            { id: 1, description: 'Tâche 1', category: 1, is_completed: false },
            { id: 2, description: 'Tâche 2', category: 2, is_completed: true }
        ];
        mockGet.mockResolvedValueOnce({ data: mockCategories }).mockResolvedValueOnce({ data: mockTasks });


        // Act: on rend le composant App, ce qui déclenche l'appel API simulé
        render(<App />);

        // Assert: les tâches sont affichées dans le composant
        expect(await screen.findByText(/Tâche 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Tâche 2/i)).toBeInTheDocument();
        // Assert: l'indicateur de chargement n'est plus affiché après le rendu des tâches
        expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    it('devrait afficher un message d\'erreur si l\'API échoue', async () => {
        // Arrange: l'API renvoie une erreur
        mockGet.mockRejectedValue(new Error('Erreur 500'));

        // Act: on rend le composant App, ce qui déclenche l'appel API simulé
        render(<App />);

        // Assert: le message d'erreur est affiché dans le composant
        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent(/Impossible de charger les données/i);
        expect(alert).toHaveStyle({ color: 'rgb(255, 0, 0)' });
        // On peut également vérifier que l'indicateur de chargement n'est plus affiché après l'erreur
        expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
});