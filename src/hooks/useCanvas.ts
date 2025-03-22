import { useEffect, useState } from 'react';
import { useCanvasContext } from '../context/CanvasContext';
import { type Canvas, type Idea } from '../types/canvas';

export function useCanvas(canvasId: string) {
  const { getCanvas, updateCanvas, addIdea, updateIdea, deleteIdea } = useCanvasContext();
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasId) {
      console.log('No canvasId provided');
      setError('No canvas ID provided');
      setLoading(false);
      return;
    }

    const loadCanvas = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching canvas with ID:', canvasId);
        const foundCanvas = getCanvas(canvasId);
        console.log('Found canvas:', foundCanvas);
        
        if (!foundCanvas) {
          setError(`Canvas with ID ${canvasId} not found`);
        }
        
        setCanvas(foundCanvas);
      } catch (err) {
        console.error('Error loading canvas:', err);
        setError('Failed to load canvas');
      } finally {
        setLoading(false);
      }
    };

    loadCanvas();
  }, [canvasId, getCanvas]);

  return {
    canvas,
    loading,
    error,
    updateCanvas: (updates: Partial<Omit<Canvas, 'ideas' | 'createdAt' | 'updatedAt'>>) => updateCanvas(canvasId, updates),
    addIdea: (idea: Omit<Idea, 'ideaId'>) => addIdea(canvasId, idea),
    updateIdea: (ideaId: string, updates: Partial<Omit<Idea, 'ideaId'>>) => updateIdea(canvasId, ideaId, updates),
    deleteIdea: (ideaId: string) => deleteIdea(canvasId, ideaId),
  };
}